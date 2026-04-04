import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { PrismaService } from '../../common/prisma.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private audit: AuditService,
  ) {}

  async seedAdminIfMissing() {
    const email = process.env.CRM_ADMIN_EMAIL;
    const password = process.env.CRM_ADMIN_PASSWORD;
    if (!email || !password) return;

    const existing = await this.prisma.crmUser.findUnique({ where: { email } });
    if (!existing) {
      await this.prisma.crmUser.create({
        data: {
          email,
          fullName: 'Administrador CRM',
          passwordHash: await hash(password, 10),
          role: 'admin',
        },
      });
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.crmUser.findUnique({ where: { email: dto.email } });
    if (!user || !user.isActive) throw new UnauthorizedException('Credenciales inválidas');

    const valid = await compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');

    return {
      accessToken: await this.jwt.signAsync({ sub: user.id, email: user.email, role: user.role }),
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
    };
  }

  async listUsers() {
    return this.prisma.crmUser.findMany({
      select: { id: true, email: true, fullName: true, role: true, isActive: true, createdAt: true, updatedAt: true },
      orderBy: [{ role: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async createUser(dto: CreateUserDto) {
    const existing = await this.prisma.crmUser.findUnique({ where: { email: dto.email } });
    if (existing) throw new UnauthorizedException('El usuario ya existe');
    const created = await this.prisma.crmUser.create({
      data: {
        email: dto.email,
        fullName: dto.fullName,
        role: dto.role || 'agent',
        passwordHash: await hash(dto.password, 10),
      },
      select: { id: true, email: true, fullName: true, role: true, isActive: true, createdAt: true, updatedAt: true },
    });
    await this.audit.log('crm_user', 'created', { entityId: created.id, actor: 'crm', payload: { email: created.email, role: created.role } });
    return created;
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const current = await this.prisma.crmUser.findUnique({ where: { id } });
    if (!current) throw new UnauthorizedException('Usuario no encontrado');

    const data: any = {};
    if (dto.fullName !== undefined) data.fullName = dto.fullName;
    if (dto.role !== undefined) data.role = dto.role;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;
    if (dto.password) data.passwordHash = await hash(dto.password, 10);

    const updated = await this.prisma.crmUser.update({
      where: { id },
      data,
      select: { id: true, email: true, fullName: true, role: true, isActive: true, createdAt: true, updatedAt: true },
    });
    await this.audit.log('crm_user', 'updated', { entityId: id, actor: 'crm', payload: dto });
    return updated;
  }

  async me(user: any) {
    if (!user?.email) throw new UnauthorizedException('No autenticado');
    const found = await this.prisma.crmUser.findUnique({ where: { email: user.email } });
    if (!found || !found.isActive) throw new UnauthorizedException('No autenticado');
    return { id: found.id, email: found.email, fullName: found.fullName, role: found.role, isActive: found.isActive };
  }
}

import { IsOptional, IsString } from 'class-validator';

export class CreateBlacklistDto {
  @IsString()
  phone!: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  createdBy?: string;
}
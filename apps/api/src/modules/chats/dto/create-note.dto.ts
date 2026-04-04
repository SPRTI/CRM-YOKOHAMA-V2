import { IsOptional, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  note!: string;

  @IsOptional()
  @IsString()
  createdBy?: string;
}

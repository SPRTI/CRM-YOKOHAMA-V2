import { IsIn, IsOptional, IsString } from "class-validator";

export class ListChatsDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsIn(["active", "with_agent", "incident", "blacklist"])
  status?: string;

  @IsOptional()
  @IsString()
  branch?: string;

  @IsOptional()
  @IsIn(["enabled", "disabled"])
  bot?: string;
}

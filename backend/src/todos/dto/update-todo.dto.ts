import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Equals,
} from 'class-validator';

export class UpdateTodoDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  text?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @Equals(null)
  deletedAt?: null;
}

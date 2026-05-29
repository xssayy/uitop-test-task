import { IsString, IsNotEmpty, IsInt, IsPositive } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  text!: string;

  @IsInt()
  @IsPositive()
  categoryId!: number;
}

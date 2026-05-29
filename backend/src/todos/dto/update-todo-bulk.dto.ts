import { IsBoolean, IsArray, IsInt } from 'class-validator';

export class UpdateTodoBulkDto {
  @IsArray()
  @IsInt({ each: true })
  ids!: number[];

  @IsBoolean()
  completed!: boolean;
}

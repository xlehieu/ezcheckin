import {
  IsArray,
  IsEnum
} from 'class-validator';

export class PolygonDto {
  @IsArray({ each: true,message:"Phải là dạng mảng 2 chiều" })
  @IsArray({ each: true,message:"Phải là dạng mảng 2 chiều" })
  // @IsNumber({}, { message:"3" })
  coordinates: number[][];
}
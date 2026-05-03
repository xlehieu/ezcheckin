import {
  IsArray,
  IsEnum
} from 'class-validator';

export class PolygonDto {
  @IsEnum(['Polygon'],{message:"Phải là chuỗi Polygon"})
  type: 'Polygon';

  @IsArray()
  @IsArray({ each: true,message:"Phải là dạng mảng 2 chiều" })
  @IsArray({ each: true,message:"Phải là dạng mảng 2 chiều" })
  // @IsNumber({}, { message:"3" })
  coordinates: number[][];
}
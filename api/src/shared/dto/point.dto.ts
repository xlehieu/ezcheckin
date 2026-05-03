import { IsArray, IsEnum, IsNumber, ArrayMinSize, ArrayMaxSize } from 'class-validator';

export class PointDto {
  @IsEnum(['Point'])
  type: 'Point';

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  coordinates: [number, number]; // [lng, lat]
}
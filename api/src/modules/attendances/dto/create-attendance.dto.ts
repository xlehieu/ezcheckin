import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsNumber,
  IsOptional
} from 'class-validator';
export class CreateAttendanceDto {
  @ApiProperty({
    description: 'object id',
    required: false,
  })
  @IsMongoId({
  message: 'shiftId không đúng định dạng MongoId',
})
  shiftId:string
  
  @ApiProperty({
    example: [106.70098, 10.77689],
    description: '[longitude, latitude]',
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'location phải là mảng' })
  @ArrayMinSize(2, { message: 'location phải có 2 phần tử' })
  @ArrayMaxSize(2, { message: 'location chỉ có 2 phần tử' })
  @IsNumber({}, { each: true, message: 'tọa độ phải là số' })
  location?: [number, number];
}

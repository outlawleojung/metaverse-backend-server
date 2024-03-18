import { GetCommonDto } from '../../../dto/get.common.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class uploadImageDto extends GetCommonDto {}

import { PartialType } from '@nestjs/swagger';
import { CreateImagesUpdateDto } from './create-images-update.dto';

export class UpdateImagesUpdateDto extends PartialType(CreateImagesUpdateDto) {}

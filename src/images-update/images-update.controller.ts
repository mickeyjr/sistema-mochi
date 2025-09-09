import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ImagesUpdateService } from './images-update.service';
import { CreateImagesUpdateDto } from './dto/create-images-update.dto';
import { UpdateImagesUpdateDto } from './dto/update-images-update.dto';

@Controller('images-update')
export class ImagesUpdateController {
  constructor(private readonly imagesUpdateService: ImagesUpdateService) {}
  

  @Post()
  create(@Body() createImagesUpdateDto: CreateImagesUpdateDto) {
    return this.imagesUpdateService.create(createImagesUpdateDto);
  }

  @Get('/:store')
  findAll(@Param() datesOfSearch) {
    return this.imagesUpdateService.findAll(datesOfSearch);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imagesUpdateService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImagesUpdateDto: UpdateImagesUpdateDto) {
    return this.imagesUpdateService.update(+id, updateImagesUpdateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imagesUpdateService.remove(+id);
  }
}

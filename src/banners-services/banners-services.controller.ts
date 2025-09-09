import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { BannersServicesService } from './banners-services.service';
import { CreateBannersServiceDto } from './dto/create-banners-service.dto';
import { UpdateBannersServiceDto } from './dto/update-banners-service.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';

@Controller('banners-services')
export class BannersServicesController {
  constructor(private readonly bannersServicesService: BannersServicesService) { }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'Imagen', maxCount: 1 },
      { name: 'ImageApp', maxCount: 1 },
    ]),
  )
  create(
    @Body() createBannersServiceDto: CreateBannersServiceDto,
    @UploadedFiles()
    files: {
      Imagen?: Express.Multer.File[];
      ImageApp?: Express.Multer.File[];
    },
  ) {
    createBannersServiceDto.File = files.Imagen?.[0];
    createBannersServiceDto.FileApp = files.ImageApp?.[0];

    return this.bannersServicesService.create(createBannersServiceDto);
  }

  @Get()
  findAll() {
    return this.bannersServicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bannersServicesService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'Imagen', maxCount: 1 },
      { name: 'ImageApp', maxCount: 1 },
    ]),
  )

  update(
    @Param('id') id: string,
    @Body() updateBannersServiceDto: UpdateBannersServiceDto,
    @UploadedFiles()
    files: {
      Imagen?: Express.Multer.File[];
      ImageApp?: Express.Multer.File[];
    },) {
    updateBannersServiceDto.File = files.Imagen?.[0];
    updateBannersServiceDto.FileApp = files.ImageApp?.[0];
    return this.bannersServicesService.update(id, updateBannersServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bannersServicesService.remove(id);
  }
}

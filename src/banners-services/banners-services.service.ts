import { HttpException, Injectable } from '@nestjs/common';
import { CreateBannersServiceDto } from './dto/create-banners-service.dto';
import { UpdateBannersServiceDto } from './dto/update-banners-service.dto';
import { InjectModel } from '@nestjs/mongoose';
import { BannersService } from './entities/banners-service.entity';
import { Model, Types } from 'mongoose';
import { reduceImageBuffer } from 'src/function/generalFuntion';
import { S3Service } from 'src/function/s3.service';


@Injectable()
export class BannersServicesService {

  constructor(
    @InjectModel(BannersService.name) private BannersServiceSchema: Model<BannersService>,
    private readonly S3Service: S3Service
  ) { }

  async create(createBannersServiceDto: CreateBannersServiceDto) {
    let image: string | null = null;
    if (createBannersServiceDto.File) {
      image = await this.S3Service.uploadImage({
        buffer: createBannersServiceDto.File.buffer,
        mimetype: createBannersServiceDto.File.mimetype,
        originalname: createBannersServiceDto.File.originalname,
        fieldname: createBannersServiceDto.File.fieldname,
        size: createBannersServiceDto.File.size,
        encoding: createBannersServiceDto.File.encoding,
      } as Express.Multer.File);
    }
    let imageApp: string | null = null;
    if (createBannersServiceDto.FileApp) {
      imageApp = await this.S3Service.uploadImage({
        buffer: createBannersServiceDto.FileApp.buffer,
        mimetype: createBannersServiceDto.FileApp.mimetype,
        originalname: createBannersServiceDto.FileApp.originalname,
        fieldname: createBannersServiceDto.FileApp.fieldname,
        size: createBannersServiceDto.FileApp.size,
        encoding: createBannersServiceDto.FileApp.encoding,
      } as Express.Multer.File);
    }
    const newBody = {
      ImagenUrl: image || null,
      ImageUrlApp: imageApp || null,
      Link: createBannersServiceDto.Link,
      position: createBannersServiceDto.position,
      Identifier: createBannersServiceDto.Identifier,
      Mimetype: createBannersServiceDto.File?.mimetype,
      MimetypeApp: createBannersServiceDto.FileApp?.mimetype,
    };


    const newBanner = new this.BannersServiceSchema(newBody);
    await newBanner.save();
    return "Banners guardados"
  }

  findAll() {
    const allBanners = this.BannersServiceSchema.find();
    return allBanners;
  }

  findOne(id: number) {
    return `This action returns a #${id} bannersService`;
  }

  async update(id: string, updateBannersServiceDto: UpdateBannersServiceDto) {
    try {
      const updatePayload: Record<string, any> = {};

      if (updateBannersServiceDto.Link !== undefined) {
        updatePayload.Link = updateBannersServiceDto.Link;
      }

      if (updateBannersServiceDto.position !== undefined) {
        updatePayload.position = updateBannersServiceDto.position;
      }

      if (updateBannersServiceDto.Identifier !== undefined) {
        updatePayload.Identifier = updateBannersServiceDto.Identifier;
      }

      if (updateBannersServiceDto.File) {
        updatePayload.ImagenUrl = await this.S3Service.uploadImage({
          buffer: updateBannersServiceDto.File.buffer,
          mimetype: updateBannersServiceDto.File.mimetype,
          originalname: updateBannersServiceDto.File.originalname,
          fieldname: updateBannersServiceDto.File.fieldname,
          size: updateBannersServiceDto.File.size,
          encoding: updateBannersServiceDto.File.encoding,
        } as Express.Multer.File);
      }

      if (updateBannersServiceDto.FileApp) {
        updatePayload.ImageUrlApp = await this.S3Service.uploadImage({
          buffer: updateBannersServiceDto.FileApp.buffer,
          mimetype: updateBannersServiceDto.FileApp.mimetype,
          originalname: updateBannersServiceDto.FileApp.originalname,
          fieldname: updateBannersServiceDto.FileApp.fieldname,
          size: updateBannersServiceDto.FileApp.size,
          encoding: updateBannersServiceDto.FileApp.encoding,
        } as Express.Multer.File);
      }

      let response = await this.BannersServiceSchema.updateOne({ _id: new Types.ObjectId(id) }, { $set: updatePayload });
      return response;
    } catch (error) {
      throw new HttpException({
        status: 500,
        error: 'Ocurrio algo en el sistema',
        message: error,
      }, 500);
    }
  }

  async remove(id: string) {
    let response = await this.BannersServiceSchema.deleteOne({ _id: new Types.ObjectId(id) });
    return response;
  }
}

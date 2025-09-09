import { HttpException, Injectable } from '@nestjs/common';
import { CreateBannersServiceDto } from './dto/create-banners-service.dto';
import { UpdateBannersServiceDto } from './dto/update-banners-service.dto';
import { InjectModel } from '@nestjs/mongoose';
import { BannersService } from './entities/banners-service.entity';
import { Model, Types } from 'mongoose';
import { reduceImageBuffer } from 'src/function/generalFuntion';


@Injectable()
export class BannersServicesService {

  constructor(
    @InjectModel(BannersService.name) private BannersServiceSchema: Model<BannersService>
  ) { }

  async create(createBannersServiceDto: CreateBannersServiceDto) {
    let image: Buffer | null = null;
    if (createBannersServiceDto.File) {
      image = await reduceImageBuffer(createBannersServiceDto.File.buffer, { esBanner: true });
    }
    let imageApp: Buffer | null = null;
    if (createBannersServiceDto.FileApp) {
      imageApp = await reduceImageBuffer(createBannersServiceDto.FileApp.buffer, { esBanner: true });
    }
    const newBody = {
      Imagen: image || null,
      ImageApp: imageApp || null,
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
        updatePayload.Imagen = updateBannersServiceDto.File?.mimetype;
        updatePayload.Imagen = await reduceImageBuffer(updateBannersServiceDto.File.buffer, { esBanner: true });

      }

      if (updateBannersServiceDto.FileApp) {
        updatePayload.Imagen = updateBannersServiceDto.FileApp?.mimetype;
        updatePayload.ImageApp = await reduceImageBuffer(updateBannersServiceDto.FileApp.buffer, { esBanner: true });
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

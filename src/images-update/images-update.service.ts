import { HttpException, Injectable } from '@nestjs/common';
import { CreateImagesUpdateDto } from './dto/create-images-update.dto';
import { UpdateImagesUpdateDto } from './dto/update-images-update.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Console } from 'console';

@Injectable()
export class ImagesUpdateService {

  constructor(
    @InjectModel('ProductByStore') private ProductByStoreModel: Model<any>,
    @InjectModel('ImageProduct') private ImageProductModel: Model<any>,
    @InjectModel('ProductosStock') private ProductosStockModel: Model<any>

  ) { }

  create(createImagesUpdateDto: CreateImagesUpdateDto) {
    return 'This action adds a new imagesUpdate';
  }


  async findAll(store: any) {
    try {
      const productos = await this.ProductByStoreModel
        .find(
          { IdStore: store.store, InStock: true },
          {
            Descripcion: 1,
            Nombre: 1,
            CodigoBarras: 1,
            IdStore: 1,
            IdProduct: 1
          }
        )
        .populate({ path: 'imagenes', select: ' UrlImage ' })
        .lean()
        .exec();
      return productos;

    } catch (error) {
      throw new HttpException({
        status: 500,
        error: 'Ocurrió algo en el sistema',
        message: error.message,
      }, 500);
    }
  }


  findOne(id: number) {
    return `This action returns a #${id} imagesUpdate`;
  }

  update(id: number, updateImagesUpdateDto: UpdateImagesUpdateDto) {
    return `This action updates a #${id} imagesUpdate`;
  }

  remove(id: number) {
    return `This action removes a #${id} imagesUpdate`;
  }
}

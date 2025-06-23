import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CrearProductoDTO } from './DTO/CrearProducto';

@Injectable()
export class ProductosService {
    constructor(
        @InjectModel('Producto') private readonly productoModel: Model<any>,
      ) {}

    async crearProducto(data: CrearProductoDTO) {
        const nuevoProducto = new this.productoModel(data);
        return await nuevoProducto.save();
    }

    async getProductos() {
        const res = await this.productoModel.find().exec();
        return res;
      }

    async getProductsByName(product: any){
      const res = await this.productoModel.find({Nombre: { $regex: `^${product.name}`, $options: 'i' } }).exec();
      return res;
    }
}

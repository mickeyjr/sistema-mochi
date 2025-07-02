import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {  CrearProductoDTO } from './DTO/CrearProducto';
import { generarIdPorFecha } from 'src/function/generalFuntion';

@Injectable()
export class ProductosService {
  constructor(
    @InjectModel('Producto') private readonly productoModel: Model<any>,
    @InjectModel('ProductsStock') private readonly ProductsStockModel: Model<any>,
  ) { }

  async crearProducto(data) {
    try {
      let idProduct = generarIdPorFecha()

      let bodyStock = {
        "idProduct": idProduct,
        "stock": data.stock
      }

      let stockProducts = new this.ProductsStockModel(bodyStock);
      await stockProducts.save();

      data.IdProduct = idProduct;

      const nuevoProducto = new this.productoModel(data);
      return await nuevoProducto.save();

    } catch (error) {
      throw new HttpException({
        status: 500,
        error: 'Ocurrio algo en el sistema',
        message: error,
      }, 500);
    }
  }

  async getProductos() {
    try {
      const res = await this.productoModel.find().exec();
      return res;
    } catch (error) {
        throw new HttpException({
        status: 500,
        error: 'Ocurrio algo en el sistema',
        message: error,
      }, 500);
    }
  }

  async getProductsByName(product: any) {
    try {
      const res = await this.productoModel.find({ Nombre: { $regex: `^${product.name}`, $options: 'i' } }).exec();
      return res;
    } catch (error) {
        throw new HttpException({
        status: 500,
        error: 'Ocurrio algo en el sistema',
        message: error,
      }, 500);
    }
  }

  async getProductsById(product: any) {
    try {
      const res = await this.productoModel.find({ IdProduct: product.id }).exec();
      return res;
    } catch (error) {
        throw new HttpException({
        status: 500,
        error: 'Ocurrio algo en el sistema',
        message: error,
      }, 500);
    }
  }
}

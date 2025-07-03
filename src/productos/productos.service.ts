import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CrearProductoDTO } from './DTO/CrearProducto';
import { generarIdPorFecha } from 'src/function/generalFuntion';
import { ProductByStoreSchema } from './schema/ProductByStore';
import { PatchProductoByStoresDTO } from './DTO/PatchProductByProduct';
import { ProductosSchema } from './schema/producto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectModel('Producto') private readonly productoModel: Model<any>,
    @InjectModel('ProductsStock') private readonly ProductsStockModel: Model<any>,
    @InjectModel('ProductByStore') private ProductByStoreSchema: Model<any>,

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

      //adicionar el guardado en la coleccion de producto por tienda.

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

  //adicionar seccion para adicion producto por tienda... Nah esto tendria que ser otro servicio y haga lo mas sencilo la alta. ##ProductByStore

  //El servicio de update por tienda tiene que ser por tienda nada mas. ##ProductByStore

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

  async getProductsStoreByName(product: any) {
    try {
      const res = await this.ProductByStoreSchema.find(
        {
          IdStore: product.store,
          Nombre: {
            $regex: `^${product.name}`, $options: 'i'
          }
        }).exec();

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

  async getProductStoreById(product: any) {
    try {
      const res = await this.ProductByStoreSchema
        .find({
          IdProduct: product.id,
          IdStore: product.idStore
        }).exec();
      return res;
    } catch (error) {
      throw new HttpException({
        status: 500,
        error: 'Ocurrio algo en el sistema',
        message: error,
      }, 500);
    }
  }

  async updateProductByStore(productUpdate: PatchProductoByStoresDTO) {
    try {
      const filter = {
        IdStore: productUpdate.IdStore,
        IdProduct: productUpdate.IdProduct

      }

      const fieldsToUpdate: Partial<PatchProductoByStoresDTO> = { ...productUpdate };
      delete fieldsToUpdate.IdProduct;
      delete fieldsToUpdate.IdStore;

      Object.keys(fieldsToUpdate).forEach((key) => {
        if (fieldsToUpdate[key] === undefined) {
          delete fieldsToUpdate[key];
        }
      });
      if (Object.keys(fieldsToUpdate).length === 0) {
        throw new HttpException({
          status: 400,
          error: "No se proporcionaron campos para actualizar",
        }, 400);
      }
      if(fieldsToUpdate.InStock == false){
        await this.ProductsStockModel.updateOne(
          filter
        ,{
          $set: {Stock: 0}
        })
      }

      const res = await this.ProductByStoreSchema.updateOne(
        filter,
        { $set: fieldsToUpdate }
      );

      return res;

    } catch (error) {
      throw new HttpException({
        status: 500,
        error: 'Ocurrio algo en el sistema',
        message: error,
      }, 500);
    }
  }
  async updateProduct(productUpdate: any) {
    try {

      const filter = {
        IdStore: productUpdate.IdStore,
        IdProduct: productUpdate.IdProduct

      }

      const fieldsToUpdate = { ...productUpdate };
      delete fieldsToUpdate.IdProduct;
      delete fieldsToUpdate.IdStore;

      Object.keys(fieldsToUpdate).forEach((key) => {
        if (fieldsToUpdate[key] === undefined) {
          delete fieldsToUpdate[key];
        }
      });
      if (Object.keys(fieldsToUpdate).length === 0) {
        throw new HttpException({
          status: 400,
          error: "No se proporcionaron campos para actualizar",
        }, 400);
      }

      const res = await this.productoModel.updateOne(
        filter,
        { $set: fieldsToUpdate }
      );

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

import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { generarIdPorFecha } from 'src/function/generalFuntion';
import { PatchProductoByStoresDTO } from './DTO/PatchProductByProductDTO';
import { PatchProductcsDTO } from './DTO/PatchProductDTO';

@Injectable()
export class ProductosService {
  constructor(
    @InjectModel('Producto') private readonly productoModel: Model<any>,
    @InjectModel('ProductsStock') private readonly ProductsStockModel: Model<any>,
    @InjectModel('ProductByStore') private ProductByStoreModel: Model<any>,

  ) { }

  async crearProducto(data) {
    try {
      let idProduct = generarIdPorFecha()

      let bodyStock = {
        "IdProduct": idProduct,
        "Stock": data.stock,
        "IdStore": data.IdStore
      }

      if(data.RegistrationType != 0){
        let stockProducts = new this.ProductsStockModel(bodyStock);
        await stockProducts.save();
        const newProoductByStore = await new this.ProductByStoreModel(data);
        return await newProoductByStore.save()
      }else{
      data.IdProduct = idProduct;

      const nuevoProducto = new this.productoModel(data);
      return await nuevoProducto.save();
      }
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
      const res = await this.ProductByStoreModel.find(
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
      const res = await this.ProductByStoreModel
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

    //verificar el proceso del iva

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
      if (fieldsToUpdate.stock) {
        const Stock = fieldsToUpdate.stock;
        await this.ProductsStockModel.updateOne(
          filter
          , {
            $set: { Stock: Stock }
          })
      }

      const res = await this.ProductByStoreModel.updateOne(
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

  async updateProduct(productUpdate: PatchProductcsDTO) {
    try {

      //verificar el proceso del iva.

      const filter = {
        IdProduct: productUpdate.IdProduct

      }

      const fieldsToUpdate: Partial<PatchProductcsDTO> = { ...productUpdate };

      const fieldsToUpdateByStores = {
        "IdProduct": productUpdate.IdProduct,
        "FechaEndExits": productUpdate.FechaEndExits,
        //"EstadoDelProducto": productUpdate.InStock ? "En Existencia" : "Sin Stock",
        "Descripcion": productUpdate.Descripcion,
        "PrecioPublico": productUpdate.PrecioPublico,
        "Nombre": productUpdate.Nombre,
      }

      delete fieldsToUpdate.IdProduct;


      Object.keys(fieldsToUpdate).forEach((key) => {
        if (fieldsToUpdate[key] === undefined) {
          delete fieldsToUpdate[key];
        }
      });

      Object.keys(fieldsToUpdateByStores).forEach((key) => {
        if (fieldsToUpdateByStores[key] === undefined) {
          delete fieldsToUpdateByStores[key];
        }
      });



      if (Object.keys(fieldsToUpdate).length === 0) {
        throw new HttpException({
          status: 400,
          error: "No se proporcionaron campos para actualizar",
        }, 400);
      }

      if (Object.keys(fieldsToUpdateByStores).length > 0) {
        const res = await this.ProductByStoreModel.updateOne(
          filter,
          { $set: fieldsToUpdateByStores }
        );

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

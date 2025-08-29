import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { generarIdPorFecha, reduceImageBuffer } from 'src/function/generalFuntion';
import { PatchProductoByStoresDTO } from './DTO/PatchProductByProductDTO';
import { PatchProductcsDTO } from './DTO/PatchProductDTO';

@Injectable()
export class ProductosService {
  constructor(
    @InjectModel('Productos') private readonly productoModel: Model<any>,
    @InjectModel('ProductsStock') private readonly ProductsStockModel: Model<any>,
    @InjectModel('ProductByStore') private ProductByStoreModel: Model<any>,
    @InjectModel('ImageProduct') private ImageProductModel: Model<any>

  ) { }

  async crearProducto(data: any) {
    try {

      let image = await reduceImageBuffer(data.Imagen.buffer);
      const nuevoProducto = new this.productoModel(data);
      await nuevoProducto.save();

      const dataImage = {
        IdProduct: nuevoProducto._id,
        ImagenMimeType: data.Imagen.mimetype,
        ImagenBuffer: image
      }

      const newImage = new this.ImageProductModel(dataImage);
      return await newImage.save();

    } catch (error) {
      throw new HttpException({
        status: 500,
        error: 'Ocurrio algo en el sistema',
        message: error,
      }, 500);
    }
  }

  async crearProductoByStore(data) {
    try {
      let bodyStock = {
        "IdProduct": data.IdProduct,
        "Stock": data.stock,
        "IdStore": data.IdStore
      }
      let stockProducts = new this.ProductsStockModel(bodyStock);
      await stockProducts.save();
      const newProoductByStore = await new this.ProductByStoreModel(data);
      return await newProoductByStore.save()

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

      const producto = await this.productoModel
        .find({
          Nombre: { $regex: `^${product.name}`, $options: 'i' }
        })
        .populate('imagenes')
        .exec();

      return producto;

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
      const producto = await this.ProductByStoreModel
        .find({
          Nombre: { $regex: `^${product.name}`, $options: 'i' },
          IdStore : product.store 
        })
        .select('IdProduct Nombre imagenes IdStore InStock EstadoDelProducto PrecioPublico Descripcion CodigoChino CodigoBarras')
        .populate({
          path: 'imagenes',
          select: 'ImagenBuffer ImagenMimeType'
        })
        .exec();

      return producto;
    } catch (error) {
      throw new HttpException({
        status: 500,
        error: 'Ocurrió algo en el sistema',
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

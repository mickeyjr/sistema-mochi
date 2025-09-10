import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { generarIdPorFecha, reduceImageBuffer } from 'src/function/generalFuntion';
import { PatchProductoByStoresDTO } from './DTO/PatchProductByProductDTO';
import { PatchProductcsDTO } from './DTO/PatchProductDTO';
import { S3Service } from 'src/function/s3.service';


@Injectable()
export class ProductosService {
  constructor(
    @InjectModel('Productos') private readonly productoModel: Model<any>,
    @InjectModel('ProductsStock') private readonly ProductsStockModel: Model<any>,
    @InjectModel('ProductByStore') private ProductByStoreModel: Model<any>,
    @InjectModel('ImageProduct') private ImageProductModel: Model<any>,
    private readonly S3Service: S3Service

  ) { }

  async crearProducto(data: any) {
    try {

      let image = await reduceImageBuffer(data.Imagen.buffer);

      const nuevoProducto = new this.productoModel(data);
      await nuevoProducto.save();

      const imageUrl = await this.S3Service.uploadImage({
        buffer: image,
        mimetype: data.Imagen.mimetype,
        originalname: data.Imagen.originalname,
        fieldname: data.Imagen.fieldname,
        size: data.Imagen.size,
        encoding: data.Imagen.encoding,
      } as Express.Multer.File);

      const dataImage = {
        IdProduct: nuevoProducto._id,
        UrlImage : imageUrl
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

  async validationProdcutByStore(data) {
    try {
      const body = {
        InStock: false,
        exists: false
      }
      let existRegisterByProduct = await this.ProductByStoreModel.findOne({
        IdProduct: new Types.ObjectId(data.IdProduct),
        IdStore: data.IdStore

      });
      if (existRegisterByProduct) {
        body.InStock = existRegisterByProduct.InStock;
        body.exists = true;
        return body;
      } else {
        return body;
      }
    } catch (error) {
      throw new HttpException({
        status: 500,
        error: 'Ocurrio algo en el sistema',
        message: error,
      }, 500);
    }
  }

  async updateProductsByStore(data: any) {
    if (data.TypeStock == 1) {
      await this.ProductsStockModel.updateOne({
        IdProduct: new Types.ObjectId(data.IdProduct),
        IdStore: data.IdStore
      }, {
        $set: {
          Stock: data.Stock
        }
      });
      await this.ProductByStoreModel.updateOne({
        IdProduct: new Types.ObjectId(data.IdProduct),
        IdStore: data.IdStore
      }, {
        $set: {
          InStock: data.Stock > 0 ? true : false,
          EstadoDelProducto: data.Stock > 0 ? "En existencia" : 'Agotado',
        }
      });
      return true;
    } else if (data.TypeStock == 2) {
      const ProductsStock = await this.ProductsStockModel.findOne({
        IdProduct: new Types.ObjectId(data.IdProduct),
        IdStore: data.IdStore
      });
      const newStock = ProductsStock.Stock + data.Stock
      await this.ProductsStockModel.updateOne({
        IdProduct: new Types.ObjectId(data.IdProduct),
        IdStore: data.IdStore
      }, {
        $set: {
          Stock: newStock
        }
      });
      await this.ProductByStoreModel.updateOne({
        IdProduct: new Types.ObjectId(data.IdProduct),
        IdStore: data.IdStore
      }, {
        $set: {
          InStock: newStock > 0 ? true : false,
          EstadoDelProducto: newStock > 0 ? "En existencia" : 'Agotado',
        }
      });
      return true;
    }
  }
  async crearProductoByStore(data: any) {
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
        .populate({ path: 'imagenes', select: 'UrlImage' })
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
          IdStore: product.store,
          InStock: true
        })
        .select('IdProduct Nombre imagenes IdStore InStock EstadoDelProducto PrecioPublico Descripcion CodigoChino CodigoBarras')
        .populate({
          path: 'imagenes',
          select: 'UrlImage'
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
  async updatePhotoByProduct(body: any) {
    try {
     // let image = await reduceImageBuffer(body.Imagen.buffer);
      const imageUrl = await this.S3Service.uploadImage({
        buffer: body.image.buffer,
        mimetype: body.image.mimetype,
        originalname: body.image.originalname,
        fieldname: body.image.fieldname,
        size: body.image.size,
        encoding: body.image.encoding,
      } as Express.Multer.File);
      const response = await this.ImageProductModel.updateOne({
        IdProduct: new Types.ObjectId(body._id)
      },
        {
          $set: {
            UrlImage: imageUrl
          }
        }
      );
      let responseBody = { 
        img : imageUrl,
        response
      };
      return responseBody;
    } catch (error) {
      throw new HttpException({
        status: 500,
        error: 'Ocurrio algo en el sistema',
        message: error,
      }, 500);
    }
  }
}
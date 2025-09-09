import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { ProductosSchema } from './schema/producto';
import { ProductStockSchema } from './schema/productsStock';
import { ProductByStoreSchema } from './schema/ProductByStore';
import { ImageProductSchema } from './schema/ImageProduct';
import { S3Service } from 'src/function/s3.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Productos', schema: ProductosSchema },
      { name: 'ProductsStock', schema: ProductStockSchema },
      { name: 'ProductByStore', schema: ProductByStoreSchema },
      { name: 'ImageProduct', schema: ImageProductSchema },

    ])
  ],
  controllers: [ProductosController],
  providers: [
    ProductosService,
    S3Service,
  ],
})
export class ProductosModule { }
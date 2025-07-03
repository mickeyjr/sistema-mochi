import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { ProductosSchema } from './schema/producto';
import { ProductStockSchema } from './schema/productsStock';
import { ProductByStoreSchema } from './schema/ProductByStore';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Producto', schema: ProductosSchema },
      { name: 'ProductsStock', schema: ProductStockSchema },
      { name: 'ProductByStore', schema: ProductByStoreSchema },

    ])
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}
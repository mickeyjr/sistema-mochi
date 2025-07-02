import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { ProductosSchema } from './schema/producto';
import { ProductStockSchema } from './schema/productsStock';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Producto', schema: ProductosSchema },
      { name: 'ProductsStock', schema: ProductStockSchema }
    ])
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}
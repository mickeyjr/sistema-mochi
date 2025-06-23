import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { ProductosSchema } from './schema/producto';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Producto', schema: ProductosSchema }])
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}
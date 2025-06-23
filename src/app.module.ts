import { Module } from '@nestjs/common';
import { ProductosModule } from './productos/productos.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SalesModule } from './sales/sales.module';


@Module({
  imports: [ProductosModule, MongooseModule.forRoot('mongodb://localhost:27017/mochi_local'), SalesModule],
})
export class AppModule {}

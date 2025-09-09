import { Module } from '@nestjs/common';
import { ProductosModule } from './productos/productos.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SalesModule } from './sales/sales.module';
import { StoresModule } from './stores/stores.module';
import { EmployesModule } from './employes/employes.module';
import { SeriesModule } from './series/series.module';
import { BrandModule } from './brand/brand.module';
import { ConfigModule } from '@nestjs/config';
import { ImagesUpdateModule } from './images-update/images-update.module';
import { BannersServicesModule } from './banners-services/banners-services.module';


@Module({
  imports: [
  ConfigModule.forRoot({ isGlobal: true }),
  ProductosModule, 
  MongooseModule.forRoot(process.env.MONGO_CONEXION!),
  SalesModule,
  StoresModule, 
  EmployesModule, 
  SeriesModule, 
  BrandModule, ImagesUpdateModule, BannersServicesModule, 
  ],
})
export class AppModule {}

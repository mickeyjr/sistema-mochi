import { Module } from '@nestjs/common';
import { BannersServicesService } from './banners-services.service';
import { BannersServicesController } from './banners-services.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BannersService, BannersServiceSchema } from './entities/banners-service.entity';
import { S3Service } from 'src/function/s3.service';

@Module({
  imports:[
    MongooseModule.forFeature([
      {name: BannersService.name, schema: BannersServiceSchema}
    ])
  ],
  controllers: [BannersServicesController],
  providers: [
    BannersServicesService,
    S3Service
  ],
})
export class BannersServicesModule {}

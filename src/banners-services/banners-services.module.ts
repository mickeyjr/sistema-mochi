import { Module } from '@nestjs/common';
import { BannersServicesService } from './banners-services.service';
import { BannersServicesController } from './banners-services.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BannersService, BannersServiceSchema } from './entities/banners-service.entity';

@Module({
  imports:[
    MongooseModule.forFeature([
      {name: BannersService.name, schema: BannersServiceSchema}
    ])
  ],
  controllers: [BannersServicesController],
  providers: [BannersServicesService],
})
export class BannersServicesModule {}

import { Module } from '@nestjs/common';
import { ImagesUpdateService } from './images-update.service';
import { ImagesUpdateController } from './images-update.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductByStoreSchema } from './entities/ProductByStore';
import { ProductStockSchema } from './entities/productsStock';
import { ImageProductSchema } from './entities/ImageProduct';

@Module({
    imports: [
    MongooseModule.forFeature([
      { name: 'ProductByStore', schema: ProductByStoreSchema },
      { name: 'ImageProduct', schema: ImageProductSchema },
      { name: 'ProductosStock', schema: ProductStockSchema }

    ])
  ],
  controllers: [ImagesUpdateController],
  providers: [ImagesUpdateService],
})
export class ImagesUpdateModule {}

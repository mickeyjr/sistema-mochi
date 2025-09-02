import { Module } from '@nestjs/common';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SaveSaleSchema } from './schema/saveSale';
import { ProductosSchema } from 'src/productos/schema/producto';
import { ProductStockSchema } from './schema/productsStock';
import { SaveSaleDetailsSchema } from './schema/detailSale';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'SaveSale', schema: SaveSaleSchema },
      { name: 'Producto', schema: ProductosSchema },
      { name: 'ProductosStock', schema: ProductStockSchema },
      { name: 'SaveSaleDetails', schema: SaveSaleDetailsSchema }, 
      { name: 'ProductByStore', schema: ProductStockSchema } 
    ])

  ],
  controllers: [SalesController],
  providers: [SalesService]
})
export class SalesModule {}

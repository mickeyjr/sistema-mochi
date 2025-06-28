import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { SalesService } from './sales.service';

@Controller('sales')
export class SalesController {

    constructor(private readonly salesService: SalesService) {}
    

   @Post('/save')
   async PostSaveSales(@Body() product: any){
    const newProducts= await this.salesService.GetInfoProduct(product);
    const exitsStock = await this.salesService.SubtractStockAndSaveSale(newProducts);
    if(!exitsStock.validator )
        throw new HttpException({
            status: 400,
            error: 'Existe un error con la existencia del stock',
            message: 'Comunicate con sistemas.',
        }, 400);
    const recalculatedProduct = await this.salesService.RecalculateSale(newProducts, product);
    return this.salesService.SaveSales(recalculatedProduct, exitsStock);
   }
}

import { Body, Controller, Get, HttpException, Param, Post, Query } from '@nestjs/common';
import { SalesService } from './sales.service';

@Controller('sales')
export class SalesController {

    constructor(private readonly salesService: SalesService) {}
    

   @Get('/getSales/:dateInit/:dateEnd')
   async GetSalesByWeek(@Param() datesOfSearch ){
    return await this.salesService.GetSalesByWeek(datesOfSearch);
   }

    @Get('getSaleById/:idSale')
    async getSalesById(@Param() params){
        return await this.salesService.getSalesById(params.idSale);
    }

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

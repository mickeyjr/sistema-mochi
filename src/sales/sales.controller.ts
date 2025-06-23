import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { SalesService } from './sales.service';

@Controller('sales')
export class SalesController {

    constructor(private readonly salesService: SalesService) {}
    

   @Post('/save')
   async PostSaveSales(@Body() product: any){
    const newProducts= await this.salesService.GetInfoProduct(product);
    const exitsStock = await this.salesService.SubtractStockAndSaveSale(newProducts);
    if(exitsStock.validator ){
        const recalculatedProduct = await this.salesService.RecalculateSale(newProducts);
        //falta crear el body para la tabla de detalleVenta y hacer el proceso de guardado.
        return this.salesService.SaveSales(recalculatedProduct, exitsStock);
    }else {
        throw new HttpException({
            status: 500,
            error: 'Existe un error en el servidor.',
            message: 'Comunicate con sistemas.',
          }, 400);
    }
   }
}

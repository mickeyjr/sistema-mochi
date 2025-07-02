import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CrearProductoDTO } from './DTO/CrearProducto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  async obtenerProductos() {
    return this.productosService.getProductos();
  }

  @Post('/byname')
  async getProdcutsByName(@Body() name: any){
    return this.productosService.getProductsByName(name);
  }

  @Post('/byId')
  async getProdcutsById(@Body() id: any){
    return this.productosService.getProductsById(id);
  }

  @Post()
  @UsePipes(new ValidationPipe)
  //Adicionar la info en la nueva tabla de stock
  async crearProducto(@Body() productoDTO: CrearProductoDTO) {
    return this.productosService.crearProducto(productoDTO);
  }

  //1.- servicio para actualizar Stock o para actualizar datos de un producto.

}

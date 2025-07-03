import { Body, Controller, Get, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CrearProductoDTO } from './DTO/CrearProductoDTO';
import { PatchProductoByStoresDTO } from './DTO/PatchProductByProductDTO';
import { PatchProductcsDTO } from './DTO/PatchProductDTO';

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

    @Post('/store/byname')
  async getProdcutsStoreByName(@Body() name: any){
    return this.productosService.getProductsByName(name);
  }

  @Post('/store/byId')
  async getProdcutsStoreById(@Body() id: any){
    return this.productosService.getProductsById(id);
  }


  @Post()
  @UsePipes(new ValidationPipe)
  async crearProducto(@Body() productoDTO: CrearProductoDTO) {
    return this.productosService.crearProducto(productoDTO);
  }

  @Patch('/store/update/products')
  @UsePipes(new ValidationPipe)
  async updateProductByStore(@Body() data: PatchProductoByStoresDTO){
    this.productosService.updateProductByStore(data);
  }

  @Patch("")
    @UsePipes(new ValidationPipe)
  async updateProduct(@Body() data: PatchProductcsDTO){
    this.productosService.updateProduct(data);
  }

}

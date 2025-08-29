import { Body, Controller, Get, Patch, Post, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CrearProductoDTO } from './DTO/CrearProductoDTO';
import { CrearProductoByStoreDTO } from './DTO/CrearProductoByStoreDTO';
import { PatchProductoByStoresDTO } from './DTO/PatchProductByProductDTO';
import { PatchProductcsDTO } from './DTO/PatchProductDTO';
import { FileInterceptor } from '@nestjs/platform-express';

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
  
    @Post('/sales/store/name')
  async getProdcutsStoreByNameStore(@Body() products: any){
    return this.productosService.getProductsStoreByName(products);
  }

  @Post('/store/byId')
  async getProdcutsStoreById(@Body() id: any){
    return this.productosService.getProductsById(id);
  }


  @Post()
  @UsePipes(new ValidationPipe)
  @UseInterceptors(FileInterceptor('Imagen'))
  async crearProducto(
    @Body() productoDTO: CrearProductoDTO, 
    @UploadedFile() file: any) {
    productoDTO.Imagen = file;
    return this.productosService.crearProducto(productoDTO);
  }

  @Post('/bystore')
  @UsePipes(new ValidationPipe)
  @UseInterceptors(FileInterceptor('Imagen'))
  async crearProductoByStore(@Body() productoDTO: CrearProductoByStoreDTO, ) {
      return this.productosService.crearProductoByStore(productoDTO);
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

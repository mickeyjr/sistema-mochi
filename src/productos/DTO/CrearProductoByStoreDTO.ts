import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CrearProductoByStoreDTO {
  @IsNotEmpty()
  @IsString()
  CodigoChino: string;

  @IsNotEmpty()
  @IsString()
  CodigoBarras: string;

  @IsNotEmpty()
  @IsString()
  Nombre: string;

  @IsNotEmpty()
  @IsString()
  Descripcion: string;

  @IsNotEmpty()
  @IsNumber()
  PrecioCosto: number;

  @IsNotEmpty()
  @IsNumber()
  PrecioUnitario: number;

  @IsNumber()
  @IsNotEmpty()
  PrecioPublico: number;

  @IsNumber()
  @IsNotEmpty()
  Contenido: number;

  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @IsString()
  @IsNotEmpty()
  EstadoDelProducto: string;

  @IsBoolean()
  @IsNotEmpty()
  InStock: boolean;

  @IsNumber()
  @IsNotEmpty()
  GananciaPorUnidad: number;

  @IsString()
  //@IsNotEmpty()
  Fecha: string;

  @IsString()
  //@IsNotEmpty()
  Lugar: string;

  @IsOptional()
  Imagen: any;

  @IsString()
  FechaEndExits: String;

  @IsString()
  IdEmployee: String;

  @IsNotEmpty()
  @IsNumber()
  RegistrationType: number;

  @IsOptional()
  @IsString()
  IdStore: string;

  @IsString()
  IdProduct: String;

}

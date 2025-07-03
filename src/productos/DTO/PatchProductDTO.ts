import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PatchProductcsDTO {

  @IsNotEmpty()
  @IsString()
  IdProduct: string;
  
  @IsOptional()
  @IsString()
  IdStore: String;

  @IsNotEmpty()
  @IsString()
  IdEmployee: String;

  @IsOptional()
  @IsString()
  CodigoChino: String;

  @IsString()
  @IsOptional()
  FechaEndExits: string;

  @IsBoolean()
  @IsOptional()
  InStock: Boolean;

  @IsString()
  @IsOptional()
  Descripcion: String;

  @IsString()
  @IsOptional()
  Nombre: String;

  @IsNumber()
  @IsOptional()
  stock: number;

  @IsNumber()
  @IsOptional()
  PrecioPublico: number;

}

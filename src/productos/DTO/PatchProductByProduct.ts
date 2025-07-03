import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PatchProductoByStoresDTO {
  @IsOptional()
  IdStore: string;

  @IsOptional()
  IdProduct: string;

  @IsNotEmpty()
  @IsString()
  IdEmployee: String;

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

}

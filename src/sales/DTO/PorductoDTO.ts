import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class ProductDTO {
  @IsString()
  @IsNotEmpty()
  idProduct: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsNumber()
  @IsNotEmpty()
  numeroDePiezas: number;
}
import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Date } from "mongoose";

export class SaveSaleDTO{
    @IsString()
    @IsNotEmpty()
    Nombre: String;
    
    @IsNumber()
    @IsNotEmpty()
    Precio: Number;
    
    @IsNotEmpty()
    @IsNumber()
    NumeroDePiezas: Number;
    
    @IsNotEmpty()
    @IsNumber()
    Ganancia: Number;

    @IsDate()
    @IsNotEmpty()
    Fecha: Date;

    @IsString()
    @IsNotEmpty()
    Lugar: String;
    
    Imagen: String;
}
import { IsArray, IsDate, IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ProductDTO } from "./PorductoDTO";

export class SaveSaleDTO{
    @IsNumber()
    @IsNotEmpty()
    PaymentReceived: number;
    
    @IsString()
    @IsNotEmpty()
    PaymentType: String;
    
    @IsNotEmpty()
    @IsString()
    SalesLocation: String;
    
    @IsNotEmpty()
    @IsString()
    IdStore: String;

    @IsString()
    @IsNotEmpty()
    IdCashRegister: String;

    @IsString()
    @IsNotEmpty()
    IdEmployee: String;

    @IsNumber()
    @IsNotEmpty()
    Total: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductDTO)
    products: ProductDTO[];
}
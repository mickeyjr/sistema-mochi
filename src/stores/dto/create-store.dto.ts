import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
//export enum StoreRole {
//  Manager = 'Manager',
//  AssistantManager = 'AssistantManager',
//  Supervisor = 'Supervisor',
//  Cashier = 'Cashier',
//  Salesperson = 'Salesperson',
//  InventoryManager = 'InventoryManager',
//  DeliveryPerson = 'DeliveryPerson',
//  StockClerk = 'StockClerk',
//  Cleaner = 'Cleaner',
//  SecurityGuard = 'SecurityGuard'
//}

export class CreateStoreDto {

    @IsNotEmpty({message:"El campo IdStore es obligatorio."})
    @IsString({message: "El campo storeId No debe de ser numerico."})
    IdStore: string;
    
    @IsNotEmpty({message:"El campo StoreName es obligatorio."})
    @IsString({message: "El campo StoreName No debe de ser numerico."})
    StoreName: String;
    
    @IsNotEmpty({message:"El campo ShortName es obligatorio."})
    @IsString({message: "El campo ShortName No debe de ser numerico."})
    ShortName: string;
    
    //@IsEnum(StoreRole)
    //@ApiProperty({ enum: StoreRole })
    //role: StoreRole;
    
    @IsNotEmpty({message:"El campo Longitud es obligatorio."})
    @IsNumber()
    Latitud: number;

    @IsNotEmpty({message:"El campo Longitud es obligatorio."})
    @IsNumber()
    Longitud: number;
    
    @IsNotEmpty({message:"El campo Address es obligatorio."})
    @IsString({message: "El campo Address No debe de ser numerico."})
    Address: string;
    
    @IsNotEmpty({message:"El campo Street es obligatorio."})
    @IsString({message: "El campo Street No debe de ser numerico."})
    Street: string;
    
    @IsNotEmpty({message:"El campo Number es obligatorio."})
    @IsString()
    Number: string;
    
    @IsNotEmpty({message:"El campo Locality es obligatorio."})
    @IsString({message: "El campo Locality No debe de ser numerico."})
    Locality: string;
    
    @IsNotEmpty({message:"El campo Municipality es obligatorio."})
    @IsString({message: "El campo Municipality No debe de ser numerico."})
    Municipality: string;
    
    @IsNotEmpty({message:"El campo State es obligatorio."})
    @IsString({message: "El campo State No debe de ser numerico."})
    State: string;
    
    @IsNotEmpty({message:"El campo Country es obligatorio."})
    @IsString({message: "El campo Country No debe de ser numerico."})
    Country: string;

}

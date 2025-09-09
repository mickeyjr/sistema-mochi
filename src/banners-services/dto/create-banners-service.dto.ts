import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateBannersServiceDto {
    
    @IsString()
    @IsNotEmpty()
    Link: string;
    @IsNotEmpty()
    @IsNumber()
    position: number;
    @IsNotEmpty()
    @IsString()
    Identifier: string;
    @IsOptional()
    File?:  Express.Multer.File;
    @IsOptional()
    FileApp?: Express.Multer.File;

}

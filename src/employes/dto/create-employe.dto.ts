import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateEmployeDto {

    @IsOptional()
    IdEmploye?: string;

    @IsNotEmpty()
    @IsString()
    FullName: string;

    @IsNotEmpty()
    @IsString()
    Age: string;

    @IsNotEmpty()
    @IsString()
    Position: string;

    @IsNotEmpty()
    @IsString()
    Role: String;

    @IsNotEmpty()
    @IsString()
    StartDate: string

    @IsString()
    Seniority?: string;
    
    @IsNotEmpty()
    @IsString()
    Address?: string;

    @IsNotEmpty()
    @IsString()
    Birthday: String

    @IsNotEmpty()
    @IsString()
    IdStore: string
}

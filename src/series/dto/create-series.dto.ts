import { IsOptional, IsString } from "class-validator";

export class CreateSeriesDto {

    @IsString()
    Serie?: string;

    @IsOptional()
    @IsString()
    num?: number;

}
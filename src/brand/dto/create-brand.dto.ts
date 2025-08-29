import { IsOptional, IsString } from "class-validator";

export class CreateBrandDto {
    @IsOptional()
    num: number;

    @IsString()
    Brand: string
}

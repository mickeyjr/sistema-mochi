import { PartialType } from '@nestjs/swagger';
import { CreateBannersServiceDto } from './create-banners-service.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateBannersServiceDto extends PartialType(CreateBannersServiceDto) {
        
        @IsOptional()
        @IsString()
        Link: string;
        
        @IsOptional()
        @IsNumber()
        position: number;
        
        @IsOptional()
        @IsString()
        Identifier: string;

        @IsOptional()
        File?:  Express.Multer.File;
        
        @IsOptional()
        FileApp?: Express.Multer.File;

}

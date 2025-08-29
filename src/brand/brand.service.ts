import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand } from './entities/brand.entity';
import { Model } from 'mongoose';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name) private brandSchema: Model <Brand>
  ){}
  async create(createBrandDto: CreateBrandDto) {
    const countBrand = await this.brandSchema.find();
    createBrandDto.num = countBrand.length + 1
    const brandData =  new this.brandSchema(createBrandDto);
    return brandData.save();
  }

  async findAll() {
    return await this.brandSchema.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} brand`;
  }

  update(id: number, updateBrandDto: UpdateBrandDto) {
    return `This action updates a #${id} brand`;
  }

  remove(id: number) {
    return `This action removes a #${id} brand`;
  }
}

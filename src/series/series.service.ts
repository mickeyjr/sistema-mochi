import { Injectable } from '@nestjs/common';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Series } from './entities/series.entity';

@Injectable()
export class SeriesService {
      
  constructor(
        @InjectModel(Series.name) private seriesModel: Model<Series>
  ){}

  async create(createSeriesDto: CreateSeriesDto) {
    const count  =await this.seriesModel.find({},{});
    createSeriesDto.num = count.length + 1;
    const SerieSave = new  this.seriesModel(createSeriesDto);
    SerieSave.save();
    return 
  }

  async findAll() {

    return await this.seriesModel.find({},{});
  }

  findOne(id: number) {
    return `This action returns a #${id} series`;
  }

  update(id: number, updateSeriesDto: UpdateSeriesDto) {
    return `This action updates a #${id} series`;
  }

  remove(id: number) {
    return `This action removes a #${id} series`;
  }
}

import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SeriesSchema , Series} from './entities/series.entity';

@Module({
    imports: [
      MongooseModule.forFeature([
        { name: Series.name, schema: SeriesSchema }
  
      ])
    ],
  controllers: [SeriesController],
  providers: [SeriesService],
})
export class SeriesModule {}

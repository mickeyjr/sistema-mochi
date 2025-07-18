import { Module } from '@nestjs/common';
import { EmployesService } from './employes.service';
import { EmployesController } from './employes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeSchema, Employe } from './entities/employe.entity'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employe.name, schema: EmployeSchema }
    ])
  ],
  controllers: [EmployesController],
  providers: [EmployesService],
})
export class EmployesModule {}

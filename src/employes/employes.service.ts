import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateEmployeDto } from './dto/create-employe.dto';
import { UpdateEmployeDto } from './dto/update-employe.dto';
import { Employe } from './entities/employe.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { generarIdPorFecha } from 'src/function/generalFuntion';

@Injectable()
export class EmployesService {
    
  constructor(
        @InjectModel(Employe.name) private employeSchema: Model<Employe>
  ){}

  create(createEmployeDto: CreateEmployeDto) {
    try {
      const IdEmployee = generarIdPorFecha();
      if(!IdEmployee){
        throw new BadRequestException('Ocurrio algo al dar de alta al empleado');
      }
      createEmployeDto.IdEmploye = IdEmployee;
      const employeSave = new this.employeSchema(createEmployeDto);
      employeSave.save();
      return employeSave
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al crear empleado');
    }
  }

  async findAllByStore(store: string ) {
    try {
        const employes = await this.employeSchema.find({IdStore:store })
        return employes;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al consultar empleados');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} employe`;
  }

  update(id: number, updateEmployeDto: UpdateEmployeDto) {
    return `This action updates a #${id} employe`;
  }

  remove(id: number) {
    return `This action removes a #${id} employe`;
  }
}

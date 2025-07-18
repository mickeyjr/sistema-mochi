import { Model } from 'mongoose';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './entities/store.entity';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class StoresService {

  constructor(
    @InjectModel(Store.name) private storeModel: Model<Store>
  ) { }

  async create(createStoreDto: CreateStoreDto) {
    try {
      const { Street, Number, Locality, Municipality, State, Country, IdStore } = createStoreDto;


      const storeExist = await this.storeModel.findOne({ IdStore: IdStore })
      if (storeExist) {
        throw new BadRequestException('La tienda ya existe');
      }

      const bodyStore = {
        ...createStoreDto,
        Address: `${Street} ${Number}, ${Locality}, ${Municipality}, ${State}, ${Country}`
      }

      const createStore = new this.storeModel(bodyStore)
      return createStore.save();

    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al crear la tienda');
    }
  }

  findAll() {
    return this.storeModel.find({});
  }

  findOne(id: String) {
    return this.storeModel.find({ IdStore: id });
  }

  async update(id: String, updateStoreDto: UpdateStoreDto) {

    try {
      const filter = {
        IdStore: id,
      }

      const fieldsToUpdate: Partial<UpdateStoreDto> = { ...updateStoreDto };

      Object.keys(fieldsToUpdate).forEach((key) => {
        if (fieldsToUpdate[key] === undefined) {
          delete fieldsToUpdate[key];
        }
      });

      if (Object.keys(fieldsToUpdate).length === 0) {
        throw new BadRequestException('No se proporcionaron campos para actualizar');
      }

      const res = await this.storeModel.updateOne(
        filter,
        { $set: fieldsToUpdate }
      );

      return res;

    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al crear la tienda');
    }
  }


  remove(id: number) {
    return `This action removes a #${id} store`;
  }
}

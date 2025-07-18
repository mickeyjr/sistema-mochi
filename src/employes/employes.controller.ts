import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmployesService } from './employes.service';
import { CreateEmployeDto } from './dto/create-employe.dto';
import { UpdateEmployeDto } from './dto/update-employe.dto';

@Controller('employes')
export class EmployesController {
  constructor(private readonly employesService: EmployesService) {}

  @Post()
  create(@Body() createEmployeDto: CreateEmployeDto) {
    return this.employesService.create(createEmployeDto);
  }

  @Get('/store/:store')
  findAll(@Param('store') store: string) {
    return this.employesService.findAllByStore(store);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeDto: UpdateEmployeDto) {
    return this.employesService.update(+id, updateEmployeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employesService.remove(+id);
  }
}

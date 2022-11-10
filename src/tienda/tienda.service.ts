import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TiendaEntity } from './tienda.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class TiendaService {
  constructor(
    @InjectRepository(TiendaEntity)
    private readonly tiendaRepository: Repository<TiendaEntity>,
  ) { }

  // Obtener todas las tiendas
  async findAll(): Promise<TiendaEntity[]> {
    return await this.tiendaRepository.find({ relations: ['productos'] });
  }

  // Obtener una tienda por ID
  async findOne(id: string): Promise<TiendaEntity> {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id },
      relations: ['productos'],
    });
    if (!tienda)
      throw new BusinessLogicException(
        'La tienda con el ID suministrado no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    return tienda;
  }

  // Crear una nueva tienda
  async create(tienda: TiendaEntity): Promise<TiendaEntity> {
    if (tienda.ciudad.length !== 3) {
      throw new BusinessLogicException('El nombre de la ciudad debe tener una logitud de tres caracteres', BusinessError.VALUE_IS_NOT_VALID);
    }
    tienda.ciudad = tienda.ciudad.toUpperCase();
    return await this.tiendaRepository.save(tienda);
  }

  // Actualizar una tienda por ID
  async update(id: string, tienda: TiendaEntity): Promise<TiendaEntity> {
    const persistedTienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id },
    });
    if (!persistedTienda)
      throw new BusinessLogicException(
        'La tienda con el ID suministrado no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    if (tienda.ciudad.length !== 3) {
      throw new BusinessLogicException('El nombre de la ciudad debe tener una logitud de tres caracteres', BusinessError.VALUE_IS_NOT_VALID);
    }
    tienda.ciudad = tienda.ciudad.toUpperCase();
    return await this.tiendaRepository.save({ ...persistedTienda, ...tienda });
  }

  // Borrar una tienda
  async delete(id: string) {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id },
    });
    if (!tienda)
      throw new BusinessLogicException(
        'La tienda con el ID suministrado no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    await this.tiendaRepository.remove(tienda);
  }

  //corrección issue "Unexpected var, use let or const instead. on product.service.ts line 113 #11"
  async add(numbers) {
    let result = 0;
    let parts = numbers.split(',');
    for (let i of parts) {
      let integer = parseInt(parts[i]);
      if (!isNaN(integer)) {
        if (integer >= 0 && integer <= 1000) {
          result += integer;
        }
      }
    }
    return result;
  }

  isNumber(test) {
    if (typeof test === 'number')
      return true;
    else
      return false;
  }

  isNotBoolean(test) {
    var retVal = false; //or any other initialization
    if (typeof test === 'boolean') {
      retVal = false;
    }
    else {
      retVal = true;
    }
    return retVal;
  }

  stringAdd(numString) {
    let val = parseInt(numString);
    if (numString === isNaN) {
      return 0;
    }
    else {
      return val;
    }
  }

  isSomeNumString(numString) {
    return numString == 5;
  }

}

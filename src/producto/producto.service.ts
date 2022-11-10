import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductoEntity } from './producto.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';
import { TipoProductoPermitido } from '../producto/producto.tipo.enum';
import { of } from 'rxjs';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) { }

  // Obtener todos los productos
  async findAll(): Promise<ProductoEntity[]> {
    return await this.productoRepository.find({ relations: ['tiendas'] });
  }

  // Obtener un producto por ID
  async findOne(id: string): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id },
      relations: ['tiendas'],
    });
    if (!producto)
      throw new BusinessLogicException(
        'El producto con el ID suministrado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    return producto;
  }

  async findOneRepeat(id: string): Promise<ProductoEntity> {
    return this.findOne(id);   
  }

  async findOneRepeat1(id: string): Promise<ProductoEntity> {
       
        return this.findOne(id);
  }

  async create(producto: ProductoEntity): Promise<ProductoEntity> {
    if (!Object.values(TipoProductoPermitido).includes(producto.tipo)) {
      throw new BusinessLogicException(`El tipo de producto no es valido, debe ser solo uno de estos: ${Object.values(TipoProductoPermitido).join(', ')}`,
        BusinessError.TYPE_IS_NOT_VALID,
      );
    }
    return await this.productoRepository.save(producto);
  }

  // Actualizar una producto por ID
  async update(id: string, producto: ProductoEntity): Promise<ProductoEntity> {
    const persistedProducto: ProductoEntity =
      await this.productoRepository.findOne({
        where: { id },
      });
    if (!persistedProducto)
      throw new BusinessLogicException(
        'El producto con el ID suministrado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    if (!Object.values(TipoProductoPermitido).includes(producto.tipo)) {
      throw new BusinessLogicException(`El tipo de producto no es valido, debe ser solo uno de estos: ${Object.values(TipoProductoPermitido).join(', ')}`,
        BusinessError.TYPE_IS_NOT_VALID,
      );
    }

    return await this.productoRepository.save({
      ...persistedProducto,
      ...producto,
    });
  }

  // Borrar un producto
  async delete(id: string) {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id },
    });
    if (!producto)
      throw new BusinessLogicException(
        'El producto con el ID suministrado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    await this.productoRepository.remove(producto);
  }

  //corrección issue "Unexpected var, use let or const instead. on product.service.ts line 113 #12"
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

  //corrección issue "Review this redundant assignment: "retVal" already holds the assigned value along all execution paths. #9"
  isNotBoolean(test) {
    return typeof test !== 'boolean';
  }

  stringAdd(numString) {
    let val = parseInt(numString);
    if (Number.isNaN(numString)) {
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


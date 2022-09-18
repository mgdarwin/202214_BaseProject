/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { ProductoEntity } from './producto.entity';
import { ProductoService } from './producto.service';
import { faker } from '@faker-js/faker';
import { TipoProductoPermitido } from './producto.tipo.enum';

describe('ProductoService', () => {
  let service: ProductoService;
  let repository: Repository<ProductoEntity>;
  let productosList: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoService],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    repository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    productosList = [];
    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await repository.save({
        nombre: faker.company.name(),
        precio: faker.finance.amount(0, 100),
        tipo: TipoProductoPermitido.PERECEDERO
      })
      productosList.push(producto);
    }
  }

  it('findAll deberia retornar todos los productos', async () => {
    const productos: ProductoEntity[] = await service.findAll();
    expect(productos).not.toBeNull();
    expect(productos).toHaveLength(productosList.length);
  });

  it('findOne deberia retornar un producto segun ID dado', async () => {
    const storedProducto: ProductoEntity = productosList[0];
    const producto: ProductoEntity = await service.findOne(storedProducto.id);
    expect(producto).not.toBeNull();
    expect(producto.nombre).toEqual(storedProducto.nombre)
    expect(producto.precio).toEqual(storedProducto.precio)
    expect(producto.tipo).toEqual(storedProducto.tipo)
  });

  it('findOne deberia retornar una excepcion para in ID de Producto invalido', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El producto con el ID suministrado no fue encontrado")
  });

  it('create deberia retornar un nuevo Producto', async () => {
    const producto: ProductoEntity = {
      id: "",
      nombre: faker.company.name(),
      precio: faker.finance.amount(0, 100),
      tipo: TipoProductoPermitido.PERECEDERO,
      tiendas: []
    }

    const newProducto: ProductoEntity = await service.create(producto);
    expect(newProducto).not.toBeNull();

    const storedProducto: ProductoEntity = await repository.findOne({ where: { id: newProducto.id } })
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toEqual(newProducto.nombre)
    expect(storedProducto.precio).toEqual(newProducto.precio)
    expect(storedProducto.tipo).toEqual(newProducto.tipo)
  });

  it('update deberia modificar un producto ya creado', async () => {
    const producto: ProductoEntity = productosList[0];
    producto.nombre = "New nombre";
    producto.precio = "New precio";

    const updatedProducto: ProductoEntity = await service.update(producto.id, producto);
    expect(updatedProducto).not.toBeNull();

    const storedProducto: ProductoEntity = await repository.findOne({ where: { id: producto.id } })
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toEqual(producto.nombre)
    expect(storedProducto.precio).toEqual(producto.precio)
  });

  it('update deberia retornar una excepcion para in ID de un producto invalido', async () => {
    let producto: ProductoEntity = productosList[0];
    producto = {
      ...producto, nombre: "New nombre", precio: "New precio"
    }
    await expect(() => service.update("0", producto)).rejects.toHaveProperty("message", "El producto con el ID suministrado no fue encontrado")
  });

  it('delete deberia borrar un productoa', async () => {
    const producto: ProductoEntity = productosList[0];
    await service.delete(producto.id);

    const deletedProducto: ProductoEntity = await repository.findOne({ where: { id: producto.id } })
    expect(deletedProducto).toBeNull();
  });

  it('delete deberia retornar una excepcion para in ID de un producto invalido', async () => {
    const producto: ProductoEntity = productosList[0];
    await service.delete(producto.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El producto con el ID suministrado no fue encontrado")
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

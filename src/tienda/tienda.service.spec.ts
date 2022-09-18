/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { TiendaEntity } from './tienda.entity';
import { TiendaService } from './tienda.service';
import { faker } from '@faker-js/faker';

describe('TiendaService', () => {
  let service: TiendaService;
  let repository: Repository<TiendaEntity>;
  let tiendasList: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaService],
    }).compile();

    service = module.get<TiendaService>(TiendaService);
    repository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    tiendasList = [];
    for (let i = 0; i < 5; i++) {
      const tienda: TiendaEntity = await repository.save({
        nombre: faker.company.name(),
        ciudad: faker.address.cityName().slice(0,2).toUpperCase(),
        direccion: faker.address.streetAddress(true)
      })
      tiendasList.push(tienda);
    }
  }

  it('findAll deberia retornar todas las tiendas', async () => {
    const tiendas: TiendaEntity[] = await service.findAll();
    expect(tiendas).not.toBeNull();
    expect(tiendas).toHaveLength(tiendasList.length);
  });

  it('findOne deberia retornar una tienda segun ID dado', async () => {
    const storedTienda: TiendaEntity = tiendasList[0];
    const tienda: TiendaEntity = await service.findOne(storedTienda.id);
    expect(tienda).not.toBeNull();
    expect(tienda.nombre).toEqual(storedTienda.nombre)
    expect(tienda.ciudad).toEqual(storedTienda.ciudad)
    expect(tienda.direccion).toEqual(storedTienda.direccion)
  });

  it('findOne deberia retornar una excepcion para in ID de tienda invalida', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "La tienda con el ID suministrado no fue encontrada")
  });

  it('create deberia retornar una nueva Tienda', async () => {
    const tienda: TiendaEntity = {
      id: "",
      nombre: faker.company.name(),
      ciudad: faker.address.cityName().slice(0,2).toUpperCase(),
      direccion: faker.address.streetAddress(true),
      productos: []
    }

    const newTienda: TiendaEntity = await service.create(tienda);
    expect(newTienda).not.toBeNull();

    const storedTienda: TiendaEntity = await repository.findOne({ where: { id: newTienda.id } })
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toEqual(newTienda.nombre)
    expect(storedTienda.ciudad).toEqual(newTienda.ciudad)
    expect(storedTienda.direccion).toEqual(newTienda.direccion)
  });

  it('update deberia modificar una tienda ya creada', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    tienda.nombre = "New nombre";
    tienda.ciudad = "New ciudad";

    const updatedTienda: TiendaEntity = await service.update(tienda.id, tienda);
    expect(updatedTienda).not.toBeNull();

    const storedTienda: TiendaEntity = await repository.findOne({ where: { id: tienda.id } })
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toEqual(tienda.nombre)
    expect(storedTienda.ciudad).toEqual(tienda.ciudad)
  });

  it('update deberia retornar una excepcion para in ID de tienda invalida', async () => {
    let tienda: TiendaEntity = tiendasList[0];
    tienda = {
      ...tienda, nombre: "New nombre", ciudad: "New ciudad"
    }
    await expect(() => service.update("0", tienda)).rejects.toHaveProperty("message", "La tienda con el ID suministrado no fue encontrada")
  });

  it('delete deberia borrar una Tienda', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    await service.delete(tienda.id);

    const deletedTienda: TiendaEntity = await repository.findOne({ where: { id: tienda.id } })
    expect(deletedTienda).toBeNull();
  });

  it('delete deberia retornar una excepcion para in ID de tienda invalida', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    await service.delete(tienda.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "La tienda con el ID suministrado no fue encontrada")
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});

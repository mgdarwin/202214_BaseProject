import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { TipoProductoPermitido } from '../producto/producto.tipo.enum';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TiendaEntity } from '../tienda/tienda.entity';
import { Repository } from 'typeorm';
import { ProductoTiendaService } from '../producto-tienda/producto-tienda.service';

// Museo ---- Producto
// Tienda -- Tienda

describe('ProductoTiendaService', () => {
  let service: ProductoTiendaService;
  let productoRepository: Repository<ProductoEntity>;
  let tiendaRepository: Repository<TiendaEntity>;
  let tiendasList: TiendaEntity[];
  let producto: ProductoEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoTiendaService],
    }).compile();

    service = module.get<ProductoTiendaService>(ProductoTiendaService);
    productoRepository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    tiendaRepository = module.get<Repository<TiendaEntity>>(
      getRepositoryToken(TiendaEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    tiendaRepository.clear();
    productoRepository.clear();

    tiendasList = [];
    for (let i = 0; i < 5; i++) {
      const tienda: TiendaEntity = await tiendaRepository.save({
        nombre: faker.company.name(),
        ciudad: faker.address.cityName().slice(0,2).toUpperCase(),
        direccion: faker.address.streetAddress(true)
      });
      tiendasList.push(tienda);
    }

    producto = await productoRepository.save({
      nombre: faker.company.name(),
      precio: faker.finance.amount(0, 100),
      tipo: TipoProductoPermitido.PERECEDERO,
      tiendas: tiendasList
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Asociar una tienda a un producto.
  it('addStoreToProduct deberia asociar una tienda a un producto', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.address.cityName().slice(0,2).toUpperCase(),
      direccion: faker.address.streetAddress(true)
    });

    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.company.name(),
      precio: faker.finance.amount(0, 100),
      tipo: TipoProductoPermitido.PERECEDERO
    })

    const result: ProductoEntity = await service.addStoreToProduct(newProducto.id, newTienda.id);
    
    expect(result.tiendas.length).toBe(1);
    expect(result.tiendas[0]).not.toBeNull();
    expect(result.tiendas[0].nombre).toBe(newTienda.nombre)
    expect(result.tiendas[0].ciudad).toBe(newTienda.ciudad)
    expect(result.tiendas[0].direccion).toBe(newTienda.direccion)
  });

  it('addStoreToProduct deberia generar una excepción si el ID de tienda es invalido', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.company.name(),
      precio: faker.finance.amount(0, 100),
      tipo: TipoProductoPermitido.PERECEDERO
    })

    await expect(() => service.addStoreToProduct(newProducto.id, "0")).rejects.toHaveProperty("message", "La tienda con el ID suministrado no fue encontrada");
  });

  it('addStoreToProduct deberia generar una excepción si el ID del producto es invalido', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.address.cityName().slice(0,2).toUpperCase(),
      direccion: faker.address.streetAddress(true)
    });

    await expect(() => service.addStoreToProduct("0", newTienda.id)).rejects.toHaveProperty("message", "El producto con el ID suministrado no fue encontrado");
  });

  // Obtener las tiendas que tienen un producto. (findStoresFromProduct)
  it('findStoresFromProduct deberia retornar todos las tiendas asociadas a un producto', async ()=>{
    const tiendas: TiendaEntity[] = await service.findStoresFromProduct(producto.id);
    expect(tiendas.length).toBe(5)
  });

  it('findStoresFromProduct deberia generar una excepción si el ID del producto es invalido', async () => {
    await expect(()=> service.findStoresFromProduct("0")).rejects.toHaveProperty("message", "El producto con el ID suministrado no fue encontrado"); 
  });


  // Actualizar las tiendas que tienen un producto. (updateStoresFromProduct)
  it('updateStoresFromProduct deberia actualizar las tiendas asociadas a un producto', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.address.cityName().slice(0,2).toUpperCase(),
      direccion: faker.address.streetAddress(true)
    });

    const updatedProducto: ProductoEntity = await service.updateStoresFromProduct(producto.id, [newTienda]);
    
    expect(updatedProducto.tiendas.length).toBe(1);
    expect(updatedProducto.tiendas[0].nombre).toBe(newTienda.nombre);
    expect(updatedProducto.tiendas[0].ciudad).toBe(newTienda.ciudad);
    expect(updatedProducto.tiendas[0].direccion).toBe(newTienda.direccion);
  });

  it('updateStoresFromProduct deberia generar una excepción si el ID del producto es invalido', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.address.cityName().slice(0,2).toUpperCase(),
      direccion: faker.address.streetAddress(true)
    });

    await expect(()=> service.updateStoresFromProduct("0", [newTienda])).rejects.toHaveProperty("message", "El producto con el ID suministrado no fue encontrado"); 
  });

  it('updateStoresFromProduct deberia generar una excepción si el ID de tienda es invalido', async () => {
    const newTienda: TiendaEntity = tiendasList[0];
    newTienda.id = "0";

    await expect(()=> service.updateStoresFromProduct(producto.id, [newTienda])).rejects.toHaveProperty("message", "La tienda con el ID suministrado no fue encontrada"); 
  });


// Eliminar la tienda que tiene un producto. (deleteStoreFromProduct)
  it('deleteStoreFromProduct deberia borrar una tienda asociada a un producto', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    
    await service.deleteStoreFromProduct(producto.id, tienda.id);

    const storedProducto: ProductoEntity = await productoRepository.findOne({where: {id: producto.id}, relations: ["tiendas"]});
    const deletedTienda: TiendaEntity = storedProducto.tiendas.find(a => a.id === tienda.id);

    expect(deletedTienda).toBeUndefined();

  });

  it('deleteStoreFromProduct deberia generar una excepción si el ID de tienda es invalido', async () => {
    await expect(()=> service.deleteStoreFromProduct(producto.id, "0")).rejects.toHaveProperty("message", "La tienda con el ID suministrado no fue encontrada"); 
  });

  it('deleteStoreFromProduct deberia generar una excepción si el ID del producto es invalido', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    await expect(()=> service.deleteStoreFromProduct("0", tienda.id)).rejects.toHaveProperty("message", "El producto con el ID suministrado no fue encontrado"); 
  });

  it('deleteStoreFromProduct should arrojar una excepción para un ID de tienda no asociado a un producto', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.address.cityName().slice(0,2).toUpperCase(),
      direccion: faker.address.streetAddress(true)
    });

    await expect(()=> service.deleteStoreFromProduct(producto.id, newTienda.id)).rejects.toHaveProperty("message", "La tienda con el ID suministrado no esa asociada al producto indicado"); 
  }); 

});


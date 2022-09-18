import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TiendaEntity } from '../tienda/tienda.entity';
import { TipoProductoPermitido } from './producto.tipo.enum';

@Entity()
export class ProductoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  precio: string;

  @Column()
  tipo: TipoProductoPermitido;

  @ManyToMany(() => TiendaEntity, tienda => tienda.productos)
  @JoinTable()
  tiendas: TiendaEntity[];
}
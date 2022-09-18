/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';
import { TipoProductoPermitido } from '../producto/producto.tipo.enum';

export class ProductoDto {
 
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly precio: string;

  @IsString()
  @IsNotEmpty()
  readonly tipo: TipoProductoPermitido;

}

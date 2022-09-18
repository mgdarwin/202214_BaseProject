/* eslint-disable prettier/prettier */
//import { IsNotEmpty } from '../../node_modules/class-validator';
import { IsNotEmpty, IsString } from 'class-validator';

export class TiendaDto {
 
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly ciudad: string;

  @IsString()
  @IsNotEmpty()
  readonly direccion: string;

}
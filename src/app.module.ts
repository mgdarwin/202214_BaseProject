import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductoEntity } from './producto/producto.entity';
import { ProductoModule } from './producto/producto.module';
import { TiendaEntity } from './tienda/tienda.entity';
import { TiendaModule } from './tienda/tienda.module';
import { ProductoTiendaModule } from './producto-tienda/producto-tienda.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ProductoModule,
    TiendaModule,
    ProductoTiendaModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: 'producto',
      entities: [ProductoEntity, TiendaEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV
        ? `${process.env.NODE_ENV}.env`
        : '.development.env',
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
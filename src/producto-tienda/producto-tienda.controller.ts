import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { TiendaDto } from '../tienda/tienda.dto';
import { ProductoTiendaService } from '../producto-tienda/producto-tienda.service';
import { TiendaEntity } from '../tienda/tienda.entity'

@Controller('productos')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoTiendaController {
    constructor(private readonly productoTiendaService: ProductoTiendaService){}

    @Post(':productoId/tiendas/:tiendaId')
    async addStoreToProduct(@Param('productoId') productoId: string, @Param('tiendaId') tiendaId: string){
        return await this.productoTiendaService.addStoreToProduct(productoId, tiendaId);
    }

    @Get(':productoId/tiendas/:tiendaId')
    async findStoreFromProduct(@Param('productoId') productoId: string, @Param('tiendaId') tiendaId: string){
        return await this.productoTiendaService.findStoreFromProduct(productoId, tiendaId);
    }

    @Get(':productoId/tiendas')
    async findStoresFromProduct(@Param('productoId') productoId: string){
        return await this.productoTiendaService.findStoresFromProduct(productoId);
    }

    @Put(':productoId/tiendas')
    async updateStoresFromProduct(@Body() tiendasDto: TiendaDto[], @Param('productoId') productoId: string){
        const tiendas = plainToInstance(TiendaEntity, tiendasDto)
        return await this.productoTiendaService.updateStoresFromProduct(productoId, tiendas);
    }
    
    @Delete(':productoId/tiendas/:tiendaId')
    @HttpCode(204)
    async deleteStoreFromProduct(@Param('productoId') productoId: string, @Param('tiendaId') tiendaId: string){
        return await this.productoTiendaService.deleteStoreFromProduct(productoId, tiendaId);
    }

}

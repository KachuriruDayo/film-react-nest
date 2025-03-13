import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';
import { ServerExceptionFilter } from '../filter/server.exception.filter';
import { ServerException } from '../exсeptions/server.exception';

@Controller('order')
@UseFilters(ServerExceptionFilter)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    const result = await this.orderService.create(createOrderDto);
    if (result.error) {
      throw new ServerException(result.error.status, result.error.message);
    } else {
      return result.data;
    }
  }
}

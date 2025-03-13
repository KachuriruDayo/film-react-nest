import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { FilmsRepository } from '../repository/films.repository';

@Module({
  controllers: [OrderController],
  providers: [OrderService, FilmsRepository],
})
export class OrderModule {}

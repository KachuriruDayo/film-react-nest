import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { FilmsRepository } from '../repository/films.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Films } from '../entity/films.entity';
import { Schedules } from '../entity/schedules.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Films, Schedules])],
  controllers: [OrderController],
  providers: [OrderService, FilmsRepository],
})
export class OrderModule {}

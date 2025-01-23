import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/order.dto';
import { FilmsRepository } from '../repository/films.repository';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}
  create(createOrderDto: CreateOrderDto) {
    return this.filmsRepository.createOrder(createOrderDto);
  }
}

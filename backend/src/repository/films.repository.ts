import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Films } from '../entity/films.entity';
import { Schedules } from '../entity/schedules.entity';

import {
  GetFilmDto,
  GetFilmsDto,
  GetScheduleResDto,
} from '../films/dto/films.dto';
import {
  CreateOrderDto,
  OrderResponseDto,
  ResponseTicketDTO,
  TicketDTO,
} from '../order/dto/order.dto';
import { v4 as uuid } from 'uuid';
import { ErrorCode, ErrorData } from '../exсeptions/error.codes';

interface Response<Type> {
  data: Type | null;
  error: ErrorData | null;
}

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectRepository(Films)
    private readonly filmsRepository: Repository<Films>,
    @InjectRepository(Schedules)
    private readonly schedulesRepository: Repository<Schedules>,
  ) {}

  private getFilmMapperFn(): (items) => GetFilmDto {
    return (root) => {
      return {
        id: root.id,
        rating: root.rating,
        director: root.director,
        tags: root.tags,
        image: root.image,
        cover: root.cover,
        title: root.title,
        about: root.about,
        description: root.description,
      };
    };
  }

  private async createOrderFn(
    items: TicketDTO[],
  ): Promise<Response<ResponseTicketDTO[]>> {
    const result = {
      data: [],
      error: null,
    };
    const ticketsLength = items.length;

    const seats = items.map((item) => {
      return `${item.row}:${item.seat}`;
    });

    if (new Set(seats).size !== seats.length) {
      result.error = {
        status: ErrorCode.BadRequest,
        message: 'Seats should not be repeated',
      };
    }

    let i = 0;
    if (result.error) return result;

    while (i < ticketsLength) {
      const ticket = items[i];
      if (!(await this.filmsRepository.findOneBy({ id: ticket.film }))) {
        result.error = {
          status: ErrorCode.BadRequest,
          message: `Film id:${ticket.film} in ticket is incorrect`,
        };
        break;
      }
      const schedule = await this.schedulesRepository.findOneBy({
        id: ticket.session,
      });
      if (!schedule) {
        result.error = {
          status: ErrorCode.BadRequest,
          message: `Session id:${ticket.session} in ticket is incorrect`,
        };
        break;
      }
      if (ticket.row > schedule.rows || ticket.seat > schedule.seats) {
        result.error = {
          status: ErrorCode.BadRequest,
          message: 'Row or seat in ticket is incorrect',
        };
        break;
      }
      if (
        schedule.taken
          .split(',')
          .find((item) => item === `${ticket.row}:${ticket.seat}`)
      ) {
        result.error = {
          status: ErrorCode.BadRequest,
          message: 'Seat in ticket is reserved',
        };
        break;
      }
      i++;
    }

    if (result.error) return result;

    let j = 0;

    while (j < ticketsLength) {
      const ticket = items[j];
      const schedule = await this.schedulesRepository.findOneBy({
        id: ticket.session,
      });
      if (schedule.taken === '') {
        await this.schedulesRepository.update(ticket.session, {
          taken: `${ticket.row}:${ticket.seat}`,
        });
      } else {
        await this.schedulesRepository.update(ticket.session, {
          taken: schedule.taken + ',' + `${ticket.row}:${ticket.seat}`,
        });
      }

      result.data.push({
        film: ticket.film,
        session: ticket.session,
        daytime: ticket.daytime,
        row: ticket.row,
        seat: ticket.seat,
        price: ticket.price,
        id: uuid(),
      });

      j++;
    }

    return result;
  }

  async findAll(): Promise<Response<GetFilmsDto>> {
    const items = await this.filmsRepository.find();
    if (items.length === 0)
      return {
        data: null,
        error: {
          status: ErrorCode.ServerError,
          message: 'Films in database is not found',
        },
      };
    const total = items.length;
    return {
      data: {
        total,
        items: items.map(this.getFilmMapperFn()),
      },
      error: null,
    };
  }

  async findScheduleById(id: string): Promise<Response<GetScheduleResDto>> {
    if (id === ':id')
      return {
        data: null,
        error: {
          status: ErrorCode.BadRequest,
          message: 'id is empty',
        },
      };
    const schedules = await this.schedulesRepository.find({
      where: { filmId: id },
      order: {
        daytime: 'asc',
      },
    });
    if (!schedules)
      return {
        data: null,
        error: {
          status: ErrorCode.BadRequest,
          message: 'Film id:${id} is incorrect',
        },
      };
    return {
      data: {
        total: schedules.length,
        items: schedules,
      },
      error: null,
    };
  }

  async createOrder(
    orderData: CreateOrderDto,
  ): Promise<Response<OrderResponseDto>> {
    const result = await this.createOrderFn(orderData.tickets);
    if (result.error) return { data: null, error: result.error };
    const total = result.data.length;
    return {
      data: {
        total,
        items: result.data,
      },
      error: result.error,
    };
  }
}

import { Injectable } from '@nestjs/common';
import mongoose, { Schema } from 'mongoose';
import {
  GetFilmDto,
  GetFilmsDto,
  GetScheduleDto,
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

const ScheduleSchema = new Schema({
  id: { type: String, required: true },
  daytime: { type: Date, required: true },
  hall: { type: Number, required: true },
  rows: { type: Number, required: true },
  seats: { type: Number, required: true },
  price: { type: Number, required: true },
  taken: { type: [String], required: true },
});

const FilmSchema = new Schema({
  id: { type: String, required: true },
  rating: { type: Number, required: true },
  director: { type: String, required: true },
  tags: { type: [String], required: true },
  image: { type: String, required: true },
  cover: { type: String, required: true },
  title: { type: String, required: true },
  about: { type: String, required: true },
  description: { type: String, required: true },
  schedule: { type: [ScheduleSchema], required: true },
});

const Film = mongoose.model('Film', FilmSchema);

@Injectable()
export class FilmsRepository {
  private getFilmMapperFn(): (Film) => GetFilmDto {
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

  private getScheduleMapperFn(item): GetScheduleDto[] {
    return item.schedule.map((el) => {
      return {
        id: el.id,
        daytime: el.daytime,
        hall: el.hall,
        rows: el.rows,
        seats: el.seats,
        price: el.price,
        taken: el.taken,
      };
    });
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
      const film = await Film.findOne({ id: ticket.film });
      if (!film) {
        result.error = {
          status: ErrorCode.BadRequest,
          message: `Film id:${ticket.film} in ticket is incorrect`,
        };
        break;
      }
      const schedule = film.schedule.find((item) => item.id === ticket.session);
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
        schedule.taken.find((item) => item === `${ticket.row}:${ticket.seat}`)
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
      await Film.findOneAndUpdate(
        { id: ticket.film, 'schedule.id': ticket.session },
        { $addToSet: { 'schedule.$.taken': `${ticket.row}:${ticket.seat}` } },
      );

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
    const items = await Film.find({});
    if (items.length === 0)
      return {
        data: null,
        error: {
          status: ErrorCode.ServerError,
          message: 'Films in database is not found',
        },
      };
    const total = await Film.countDocuments({});
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
    const item = await Film.findOne({ id: id });
    if (!item)
      return {
        data: null,
        error: {
          status: ErrorCode.BadRequest,
          message: 'Film id:${id} is incorrect',
        },
      };
    const schedule = this.getScheduleMapperFn(item);
    return {
      data: {
        total: schedule.length,
        items: schedule,
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

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ConfigModule } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Schedules } from '../src/entity/schedules.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('testing the application for query execution', () => {
  let app: INestApplication;
  let repository: Repository<Schedules>;

  const filmId = '92b8a2a7-ab6b-4fa9-915b-d27945865e39';
  const orderData = {
    email: 'test@mail.ru',
    phone: '999999999999999',
    tickets: [
      {
        film: '92b8a2a7-ab6b-4fa9-915b-d27945865e39',
        session: '5274c89d-f39c-40f9-bea8-f22a22a50c8a',
        daytime: '2024-06-28T10:00:53+03:00',
        row: 4,
        seat: 4,
        price: 350,
      },
      {
        film: '92b8a2a7-ab6b-4fa9-915b-d27945865e39',
        session: '5274c89d-f39c-40f9-bea8-f22a22a50c8a',
        daytime: '2024-06-28T10:00:53+03:00',
        row: 3,
        seat: 3,
        price: 350,
      },
    ],
  };
  const orderResponse = {
    total: 2,
    items: [
      {
        film: '92b8a2a7-ab6b-4fa9-915b-d27945865e39',
        session: '5274c89d-f39c-40f9-bea8-f22a22a50c8a',
        daytime: '2024-06-28T10:00:53+03:00',
        row: 4,
        seat: 4,
        price: 350,
      },
      {
        film: '92b8a2a7-ab6b-4fa9-915b-d27945865e39',
        session: '5274c89d-f39c-40f9-bea8-f22a22a50c8a',
        daytime: '2024-06-28T10:00:53+03:00',
        row: 3,
        seat: 3,
        price: 350,
      },
    ],
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        await ConfigModule.forRoot({ envFilePath: '.env.testing' }),
        AppModule,
      ],
    }).compile();

    repository = moduleFixture.get<Repository<Schedules>>(
      getRepositoryToken(Schedules),
    );
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should get list of films', () => {
    return request(app.getHttpServer())
      .get('/films')
      .expect(200)
      .expect({
        total: 1,
        items: [
          {
            id: '92b8a2a7-ab6b-4fa9-915b-d27945865e39',
            rating: 8.1,
            director: 'Амелия Хьюз',
            tags: 'Рекомендуемые',
            image: '/bg6s.jpg',
            cover: '/bg6c.jpg',
            title: 'Сон в летний день',
            about:
              'Фэнтези-фильм о группе друзей попавших в волшебный лес, где время остановилось.',
            description:
              'Причудливый фэнтези-фильм, действие которого происходит в волшебном лесу, где время остановилось. Группа друзей натыкается на это заколдованное царство и поначалу проникается беззаботным духом обитателей, но потом друзьям приходится разойтись. А как встретиться снова, если нет ни времени, ни места встречи?',
          },
        ],
      });
  });

  it('should get list of schedules', () => {
    return request(app.getHttpServer())
      .get(`/films/${filmId}/shedule`)
      .expect(200)
      .expect({
        total: 9,
        items: [
          {
            id: '5274c89d-f39c-40f9-bea8-f22a22a50c8a',
            daytime: '2024-06-28T10:00:53+03:00',
            hall: 0,
            rows: 5,
            seats: 10,
            price: 350,
            taken: '',
            filmId: '92b8a2a7-ab6b-4fa9-915b-d27945865e39',
          },
          {
            id: '3f7ed030-230c-4b06-bfc7-eeaee7f3f79b',
            daytime: '2024-06-28T14:00:53+03:00',
            hall: 1,
            rows: 5,
            seats: 10,
            price: 350,
            taken: '',
            filmId: '92b8a2a7-ab6b-4fa9-915b-d27945865e39',
          },
          {
            id: '8e8c2627-4578-42b1-a59a-9ec4964a03e1',
            daytime: '2024-06-28T16:00:53+03:00',
            hall: 2,
            rows: 5,
            seats: 10,
            price: 350,
            taken: '',
            filmId: '92b8a2a7-ab6b-4fa9-915b-d27945865e39',
          },
          {
            id: '940e657a-69fa-4f71-a48e-3c064dcb61fd',
            daytime: '2024-06-29T11:00:53+03:00',
            hall: 0,
            rows: 5,
            seats: 10,
            price: 350,
            taken: '',
            filmId: '92b8a2a7-ab6b-4fa9-915b-d27945865e39',
          },
          {
            id: 'ffde1149-dbc7-49b2-964d-a8de6a45709c',
            daytime: '2024-06-29T15:00:53+03:00',
            hall: 1,
            rows: 5,
            seats: 10,
            price: 350,
            taken: '',
            filmId: '92b8a2a7-ab6b-4fa9-915b-d27945865e39',
          },
          {
            id: '6a0d0a68-2f74-4164-aac5-45e0e07adb86',
            daytime: '2024-06-29T17:00:53+03:00',
            hall: 2,
            rows: 5,
            seats: 10,
            price: 350,
            taken: '',
            filmId: '92b8a2a7-ab6b-4fa9-915b-d27945865e39',
          },
          {
            id: '9d3d3914-ea59-46a0-80a2-4e320e82956a',
            daytime: '2024-06-30T12:00:53+03:00',
            hall: 0,
            rows: 5,
            seats: 10,
            price: 350,
            taken: '',
            filmId: '92b8a2a7-ab6b-4fa9-915b-d27945865e39',
          },
          {
            id: '5c68663d-1a71-401c-9214-e79af571c347',
            daytime: '2024-06-30T16:00:53+03:00',
            hall: 1,
            rows: 5,
            seats: 10,
            price: 350,
            taken: '',
            filmId: '92b8a2a7-ab6b-4fa9-915b-d27945865e39',
          },
          {
            id: '2644a72a-6f17-4c61-a405-9c48bb0ea682',
            daytime: '2024-06-30T18:00:53+03:00',
            hall: 2,
            rows: 5,
            seats: 10,
            price: 350,
            taken: '',
            filmId: '92b8a2a7-ab6b-4fa9-915b-d27945865e39',
          },
        ],
      });
  });

  it('should reserve seats and return the appropriate response', () => {
    return request(app.getHttpServer())
      .post('/order')
      .send(orderData)
      .expect(201)
      .expect(async (res) => {
        expect(res.body).toMatchObject(orderResponse);
      });
  });

  it('should add seats in data base', async () => {
    const schedule = await repository.findOneBy({
      id: '5274c89d-f39c-40f9-bea8-f22a22a50c8a',
    });
    expect(schedule.taken).toBe('4:4,3:3');
  });
});

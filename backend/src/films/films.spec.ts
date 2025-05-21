import { Test } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let filmsController: FilmsController;
  let filmsService: FilmsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [FilmsService],
    })
      .overrideProvider(FilmsService)
      .useValue({
        findAll: jest.fn(() => {
          return {
            error: null,
            data: 'test data',
          };
        }),
        findScheduleById: jest.fn((id: string) => {
          return {
            error: null,
            data: id,
          };
        }),
      })
      .compile();

    filmsController = moduleRef.get<FilmsController>(FilmsController);
    filmsService = moduleRef.get<FilmsService>(FilmsService);
  });

  it('.getAll() should call getAll method of the service', () => {
    filmsController.findAll();
    expect(filmsService.findAll).toHaveBeenCalledTimes(1);
  });

  it('.getOne() should call findScheduleById method of the service', () => {
    const urlParams = { id: '23', other: 'other' };

    filmsController.findOne(urlParams);
    expect(filmsService.findScheduleById).toHaveBeenCalledTimes(1);
    expect(filmsService.findScheduleById).toHaveBeenCalledWith(urlParams.id);
  });
});

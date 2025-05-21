import { Test } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

const createOrderDto = new CreateOrderDto();

describe('OrderController', () => {
  let orderController: OrderController;
  let orderService: OrderService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [OrderService],
    })
      .overrideProvider(OrderService)
      .useValue({
        create: jest.fn(() => {
          return {
            error: null,
            data: 'test data',
          };
        }),
      })
      .compile();

    orderController = moduleRef.get<OrderController>(OrderController);
    orderService = moduleRef.get<OrderService>(OrderService);
  });

  it('.create() should call create method of the service', () => {
    orderController.create(createOrderDto);
    expect(orderService.create).toHaveBeenCalledTimes(1);
    expect(orderService.create).toHaveBeenCalledWith(createOrderDto);
  });
});

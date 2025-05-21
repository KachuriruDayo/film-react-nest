import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { ServerExceptionFilter } from './server.exception.filter';
import { ServerException } from '../exсeptions/server.exception';
import { ErrorCode } from '../exсeptions/error.codes';

const mockJson = jest.fn();

const mockStatus = jest.fn().mockImplementation(() => ({
  json: mockJson,
}));

const mockGetResponse = jest.fn().mockImplementation(() => ({
  status: mockStatus,
}));

const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getResponse: mockGetResponse,
  getRequest: jest.fn(),
}));

const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

describe('Server exceptions filter is works out the errors', () => {
  let service: ServerExceptionFilter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerExceptionFilter],
    }).compile();
    service = module.get<ServerExceptionFilter>(ServerExceptionFilter);
  });

  describe('Exception filter tests', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('sending an error response', () => {
      service.catch(
        new ServerException(ErrorCode.BadRequest, 'test error message'),
        mockArgumentsHost,
      );
      expect(mockHttpArgumentsHost).toBeCalledTimes(1);
      expect(mockHttpArgumentsHost).toBeCalledWith();
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(mockGetResponse).toBeCalledWith();
      expect(mockStatus).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockJson).toBeCalledTimes(1);
      expect(mockJson).toBeCalledWith({
        error: 'test error message',
      });
    });
  });
});

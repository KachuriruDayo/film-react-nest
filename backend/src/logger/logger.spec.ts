import { JsonLogger } from './jsonLogger';
import { TSKVLogger } from './tskvLogger';

describe('Logger services', () => {
  let jsonLogger: JsonLogger;
  let tskvLogger: TSKVLogger;

  beforeEach(() => {
    jsonLogger = new JsonLogger();
    tskvLogger = new TSKVLogger();
  });

  describe('Json logger', () => {
    it('should returning logs in json format', () => {
      expect(jsonLogger.formatMessage('log', 'message')).toBe(
        JSON.stringify({ level: 'log', message: 'message' }),
      );

      expect(jsonLogger.formatMessage('error', 'message', 'another data')).toBe(
        JSON.stringify({
          level: 'error',
          message: 'message',
          trace: 'another data',
        }),
      );
    });

    it('should call formatMessage method', () => {
      const formater = jest.spyOn(jsonLogger, 'formatMessage');
      const log = jest.spyOn(jsonLogger, 'log');
      const error = jest.spyOn(jsonLogger, 'error');

      jsonLogger.log('test message');
      expect(log).toHaveBeenCalledTimes(1);
      expect(log).toHaveBeenCalledWith('test message');
      expect(formater).toHaveBeenCalledTimes(1);
      expect(formater).toHaveBeenCalledWith('log', 'test message');

      jsonLogger.error('test message', 'another data');
      expect(error).toHaveBeenCalledTimes(1);
      expect(error).toHaveBeenCalledWith('test message', 'another data');
      expect(formater).toHaveBeenCalledTimes(2);
      expect(formater).toHaveBeenCalledWith(
        'error',
        'test message',
        'another data',
      );
    });
  });

  describe('TSKV Logger', () => {
    it('should returning logs in tskv format', () => {
      expect(tskvLogger.formatMessage('log', 'message')).toBe('log\tmessage\n');

      expect(tskvLogger.formatMessage('error', 'message', 'another data')).toBe(
        'error\tmessage\tanother data\n',
      );
    });

    it('should call formatMessage method', () => {
      const formater = jest.spyOn(tskvLogger, 'formatMessage');
      const log = jest.spyOn(tskvLogger, 'log');
      const error = jest.spyOn(tskvLogger, 'error');

      tskvLogger.log('test message');
      expect(log).toHaveBeenCalledTimes(1);
      expect(log).toHaveBeenCalledWith('test message');
      expect(formater).toHaveBeenCalledTimes(1);
      expect(formater).toHaveBeenCalledWith('log', 'test message');

      tskvLogger.error('test message', 'another data');
      expect(error).toHaveBeenCalledTimes(1);
      expect(error).toHaveBeenCalledWith('test message', 'another data');
      expect(formater).toHaveBeenCalledTimes(2);
      expect(formater).toHaveBeenCalledWith(
        'error',
        'test message',
        'another data',
      );
    });
  });
});

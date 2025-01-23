import { Controller, Get, Param, UseFilters } from '@nestjs/common';
import { FilmsService } from './films.service';
import { UrlParams } from './dto/films.dto';
import { ServerExceptionFilter } from '../filter/server.exception.filter';
import { ServerException } from '../exсeptions/server.exception';

@Controller('films')
@UseFilters(ServerExceptionFilter)
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async findAll() {
    const result = await this.filmsService.findAll();
    if (result.error) {
      throw new ServerException(result.error.status, result.error.message);
    } else {
      return result.data;
    }
  }

  @Get(':id/:schedule')
  async findOne(@Param() params: UrlParams) {
    const result = await this.filmsService.findScheduleById(params.id);
    if (result.error) {
      throw new ServerException(result.error.status, result.error.message);
    } else {
      return result.data;
    }
  }
}

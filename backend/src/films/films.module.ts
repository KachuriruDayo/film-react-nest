import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { FilmsRepository } from '../repository/films.repository';

@Module({
  controllers: [FilmsController],
  providers: [FilmsService, FilmsRepository],
})
export class FilmsModule {}

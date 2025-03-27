export class GetScheduleDto {
  id: string;
  daytime: string;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string;
}

export class GetFilmDto {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  image: string;
  cover: string;
  title: string;
  about: string;
  description: string;
}

export class GetFilmsDto {
  total: number;
  items: GetFilmDto[];
}

export class GetScheduleResDto {
  total: number;
  items: GetScheduleDto[];
}

export interface UrlParams {
  id: string;
  other: string;
}

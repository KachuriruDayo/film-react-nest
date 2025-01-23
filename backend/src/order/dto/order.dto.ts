export class TicketDTO {
  film: string;
  session: string;
  daytime: Date;
  row: number;
  seat: number;
  price: number;
}

export class ResponseTicketDTO {
  film: string;
  session: string;
  daytime: Date;
  row: number;
  seat: number;
  price: number;
  id: string;
}

export class CreateOrderDto {
  email: string;
  phone: string;
  tickets: TicketDTO[];
}

export class OrderResponseDto {
  total: number;
  items: ResponseTicketDTO[];
}

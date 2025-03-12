export interface CreateBookingDto {
  resourceId: string;
  userId: string;
  startTime: string;
  endTime: string;
  needTablesAndChairs: boolean;
}

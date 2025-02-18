export interface CreateBookingDto {
  resourceId: string;
  userId: string;
  startTime: string;
  endTime: string;
}

export interface CheckAvailabilityDto {
  resourceId: string;
  startTime: string;
  endTime: string;
}

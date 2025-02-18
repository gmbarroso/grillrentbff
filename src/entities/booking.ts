import { User } from './user';
import { Resource } from './resource';

export class Booking {
  id: string;
  resourceId: string;
  startTime: Date;
  endTime: Date;
  userId: string;
  user: User;
  resource: Resource;

  constructor(id: string, resourceId: string, startTime: Date, endTime: Date, userId: string, user: User, resource: Resource) {
    this.id = id;
    this.resourceId = resourceId;
    this.startTime = startTime;
    this.endTime = endTime;
    this.userId = userId;
    this.user = user;
    this.resource = resource;
  }
}

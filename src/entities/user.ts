export class User {
  id!: string;
  name!: string;
  email!: string;
  password!: string;
  apartment!: string;
  block!: number;
  role!: string;
}

export enum UserRole {
  ADMIN = 'admin',
  RESIDENT = 'resident',
}

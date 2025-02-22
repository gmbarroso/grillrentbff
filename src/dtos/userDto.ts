export interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
  apartment: string;
  block: number;
}

export interface LoginUserDto {
  apartment: string;
  block: number;
  password: string;
}

export interface UpdateUserProfileDto {
  name?: string;
  email?: string;
  password?: string;
}

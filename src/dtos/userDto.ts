export interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
  apartment: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface UpdateUserProfileDto {
  name?: string;
  email?: string;
  apartment?: string;
}

export interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
  apartment: string;
}

export interface LoginUserDto {
  name: string;
  password: string;
}

export interface UpdateUserProfileDto {
  name?: string;
  email?: string;
  apartment?: string;
}

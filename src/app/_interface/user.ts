import { Role } from "./role";

export interface User {
  new_password?: number;
  id: number;
  fullname: string;
  phone: string;
  age: string;
  gender: 'male' | 'female';
  position: string;
  username?: string;
  password?: string;
  role?: Role;
  token?: string;
}

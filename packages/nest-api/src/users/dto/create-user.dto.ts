export class CreateUserDto {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isActive: boolean;
}

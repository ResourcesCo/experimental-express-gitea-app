import { UserData } from '../user.interface';

export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: UserData;
}

import { IsString } from 'class-validator'; // Import class-validator for validation
import { UserRole, UserSource } from 'src/common/interfaces/user.interface';

export class LoginGoogleInput {
  @IsString()
  token: string;
}

export class LoginGoogleOutput {
  accessToken: string;
}

export class UserGoogleDto {
  email: string;
  name: string;
  givenName: string;
  familyName: string;
  picture: string;
  googleData: {
    id: string;
    token: string;
  };
  source: UserSource;
  roles: [UserRole]
}

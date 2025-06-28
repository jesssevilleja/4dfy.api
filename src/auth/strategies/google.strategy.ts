import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UserGoogleDto } from '../dto/google.dto';
import { AuthService } from '../auth.service';
import { UserRole, UserSource } from 'src/common/interfaces/user.interface';

@Injectable()
export class GoogleOAuthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get('google.clientID'),
      clientSecret: configService.get('google.clientSecret'),
      callbackURL: configService.get('google.callbackURL'),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    console.log('validate', accessToken, profile);
    // const user: UserGoogleDto = {
    //   email: emails[0].value,
    //   name: displayName,
    //   givenName: name?.givenName,
    //   familyName: name?.familyName,
    //   picture: photos[0].value,
    //   googleData: {
    //     id: id,
    //     token: accessToken,
    //   },
    //   source: UserSource.Google,
    //   roles:[UserRole.CUSTOMER],
    // };
    const user = await this.authService.validateGoogleUser(profile.email);
    done(null, user);
  }
}

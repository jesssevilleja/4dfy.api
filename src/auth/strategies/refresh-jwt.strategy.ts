import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    private userService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: (req) => {
        const authHeader = req.headers.authorization;
        console.log('RefreshJwtStrategy - authHeader', authHeader);
        if (!authHeader) {
          return null;
        }
        if (authHeader.startsWith('Refresh ')) {
          return authHeader.substring(8);
        }
        return null;
      },
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.refreshTokenSecret'),
    });
  }

  async validate(payload: any) {
    console.log('Refresh Token Payload:', payload);
    if (!payload || !payload.sub) {
      throw new Error('Invalid token');
    }
    return payload;
  }
}

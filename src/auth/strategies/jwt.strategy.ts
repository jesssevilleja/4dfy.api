import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.tokenSecret'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    console.log('JWT Payload:', payload);
    const user = await this.userService.findUserById(payload.sub);
    console.log('Found user:', user);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}

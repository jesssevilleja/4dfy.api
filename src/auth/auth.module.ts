import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleOAuthStrategy } from './strategies/google.strategy';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    UsersModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    RefreshJwtStrategy,
    AuthResolver,
    GoogleOAuthStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}

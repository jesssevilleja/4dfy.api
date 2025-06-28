import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/schema/user.schema';
import { UsersService } from 'src/users/users.service';
import { IUser } from 'src/users/interface/user.interface';
import {
  ChangePasswordInput,
  ForgetPasswordInput,
  PasswordChangeResponse,
  RefreshTokenResponse,
  ResetPasswordInput,
  VerifyForgetPasswordTokenInput,
} from './dto/auth-login.dto';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private client: OAuth2Client;

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private userService: UsersService,
  ) {
    this.client = new OAuth2Client(this.configService.get('google.clientID')); // Your Google Client ID
  }

  async validateSocialToken(
    provider: string,
    accessToken: string,
  ): Promise<{ email: string; name: string; picture: string }> {
    if (provider === 'google') {
      return this.validateGoogleToken(accessToken);
    } else if (provider === 'facebook') {
      return this.validateFacebookToken(accessToken);
    }
    // Add other providers here (e.g., Facebook, Twitter) if needed
    throw new UnauthorizedException('Unsupported provider');
  }

  private async validateFacebookToken(
    token: string,
  ): Promise<{ email: string; name: string; picture: string }> {
    try {
      // Fetch user data from Facebook Graph API
      const response = await fetch(
        `https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture`,
      );
      if (!response.ok) {
        throw new UnauthorizedException('Invalid token');
      }
      const data = await response.json();
      const { email, name, picture } = data; // Extract user data from the response
      return { email, name, picture: picture.data.url }; // Return user data
    } catch (error) {
      console.error('Token validation error:', error);
      throw new UnauthorizedException('Invalid token'); // Throw an error if the token is invalid
    }
  }

  private async validateGoogleToken(
    token: string,
  ): Promise<{ email: string; name: string; picture: string }> {
    try {
      // Verify the token with Google
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: this.configService.get('google.clientID'), // Specify the CLIENT_ID of the app that accesses the backend
      });

      // Get the payload from the verified token
      const payload = ticket.getPayload();
      const email = payload['email']; // User's email
      const name = payload['name']; // User's name
      const picture = payload['picture']; // User's profile picture
      // Return the user data
      return { email, name, picture };
    } catch (error) {
      console.error('Token validation error:', error);
      throw new UnauthorizedException('Invalid token'); // Throw an error if the token is invalid
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async validateGoogleUser(email: string): Promise<User> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async registerSocialUser(socialUser: CreateUserInput): Promise<User> {
    const user = await this.userService.findUserByEmail(socialUser.email);

    if (user) {
      return user;
    }

    return await this.userService.createUser(socialUser);
  }

  // async generateToken(user: User) {
  //   const payload = { email: user.email, sub: user.id };
  //   return {
  //     token: this.jwtService.sign(payload),
  //   };
  // }

  async generateAccessToken(userId: string): Promise<string> {
    return await this.jwtService.signAsync(
      { sub: userId },
      {
        secret: this.configService.get('auth.tokenSecret'),
        expiresIn: this.configService.get('auth.tokenExpiresIn'),
      },
    );
  }

  async generateRefreshToken(userId: string): Promise<string> {
    return await this.jwtService.signAsync(
      { sub: userId },
      {
        secret: this.configService.get('auth.refreshTokenSecret'),
        expiresIn: this.configService.get('auth.refreshTokenExpiresIn'),
      },
    );
  }

  async loginGoogle(user: IUser) {
    if (!user) {
      return 'No user from google';
    }

    // Check if user exists in database
    let existingUser = await this.userService.findUserByEmail(user.email);

    if (!existingUser) {
      await this.userService.createUser(user);
    }

    //const payload = { email: existingUser.email, sub: existingUser.id };

    // return {
    //   access_token: await this.generateAccessToken(user.id),
    //   user: existingUser,
    // };
  }

  async googleAuthRedirect(user: IUser) {
    const existingUser = await this.userService.findUserByEmail(user.email);

    if (!existingUser) {
      await this.userService.createUser(user);
    }

    const accessToken = await this.generateAccessToken(user.id);
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      ok: true,
      message: 'login successful',
      data: {
        accessToken,
        refreshToken,
        user,
      },
    };
  }

  async refreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<RefreshTokenResponse> {
    const user = await this.userService.findUserById(userId);

    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    console.log('userId', userId);
    console.log('refreshToken', refreshToken);
    const isRefreshTokenValid = await this.userService.validateRefreshToken(
      user.refreshToken,
      refreshToken,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newRefreshToken = await this.generateRefreshToken(user.id);
    const newAccessToken = await this.generateAccessToken(user.id);

    // Store new refresh token in the database
    await this.userService.setRefreshToken(user.id, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async invalidateToken(user: User): Promise<void> {
    // Logic to invalidate the current user's token
    // For example, if using JWTs, you might add the token to a blacklist

    // Example: Assuming you have a token storage mechanism
    // await this.tokenRepository.invalidateUserToken(user.id);

    // If using a blacklist approach, you might do something like:
    // await this.tokenBlacklistService.addToBlacklist(user.id);
    // Remove refresh token from the database
    await this.userService.setRefreshToken(user.id, null);

    console.log(`Token invalidated for user: ${user.id}`); // Placeholder for actual logic
  }

  // async login(loginInput: LoginInput): Promise<AuthResponse> {
  //   console.log(loginInput);
  //   const user = [...this.users].find((u) => u.email === loginInput.email);
  //   if (user) {
  //     console.log(user);
  //     const permissions = [...user.permissions].map((p) => p.name);
  //     return {
  //       token: 'jwt token',
  //       permissions,
  //       role: 'super_admin',
  //     };
  //   }
  //   return {
  //     token: 'jwt token',
  //     permissions: ['super_admin', 'customer'],
  //     role: 'super_admin',
  //   };
  // }

  async changePassword(
    changePasswordInput: ChangePasswordInput,
  ): Promise<PasswordChangeResponse> {
    return {
      success: true,
      message: 'Password change successful',
    };
  }

  async forgetPassword(
    forgetPasswordInput: ForgetPasswordInput,
  ): Promise<PasswordChangeResponse> {
    return {
      success: true,
      message: 'Password change successful',
    };
  }

  async verifyForgetPasswordToken(
    verifyForgetPasswordTokenInput: VerifyForgetPasswordTokenInput,
  ): Promise<PasswordChangeResponse> {
    return {
      success: true,
      message: 'Password change successful',
    };
  }

  async resetPassword(
    resetPasswordInput: ResetPasswordInput,
  ): Promise<PasswordChangeResponse> {
    return {
      success: true,
      message: 'Password change successful',
    };
  }
}

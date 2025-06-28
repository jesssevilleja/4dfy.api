import { Args, Mutation, Resolver } from '@nestjs/graphql';
import {
  AuthResponse,
  ChangePasswordInput,
  ForgetPasswordInput,
  LoginInput,
  LoginResponse,
  OtpInput,
  OtpLoginInput,
  OtpResponse,
  PasswordChangeResponse,
  RefreshTokenInput,
  RefreshTokenResponse,
  ResetPasswordInput,
  SocialLoginInput,
  UpdateEmailUserInput,
  VerifyForgetPasswordTokenInput,
  VerifyOtpInput,
} from './dto/auth-login.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/schema/user.schema';
import {
  UserRole,
  UserSource,
  UserStatus,
} from 'src/common/interfaces/user.interface';
import { SuccessResponse } from 'src/common/dto/success-response.model';
import { GqlAuthGuard } from 'src/common/guards/gql-auth.guard';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  RegisterUserInput,
  RegisterUserOutput,
} from 'src/users/dto/create-user.input';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshAuthGuard } from 'src/common/guards/refresh-auth.guard';
import { RequestSub } from 'src/common/decorators/request-sub.decorator';

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Mutation(() => RegisterUserOutput)
  async registerUser(
    @Args('input') registerUserInput: RegisterUserInput,
  ): Promise<RegisterUserOutput> {
    const user = await this.usersService.registerUser(registerUserInput);
    console.log('user', user);
    const accessToken = await this.authService.generateAccessToken(user.id);
    const refreshToken = await this.authService.generateRefreshToken(user.id);
    // Construct the response based on RegisterUserOutput fields

    // Store refresh token in the database
    await this.usersService.setRefreshToken(user.id, refreshToken);
    
    return {
      // id: registeredUser.id, // Assuming registeredUser has an id field
      // name: registeredUser.name, // Assuming registeredUser has an email field
      accessToken,
      refreshToken,
      user, // Assuming registeredUser has a roles field
    };
  }

  @Mutation(() => AuthResponse)
  async login(@Args('input') input: LoginInput): Promise<AuthResponse> {
    // First validate the user
    console.log('login input', input);
    const user = await this.authService.validateUser(
      input.email,
      input.password,
    );
    // Then generate token for validated user
    const accessToken = await this.authService.generateAccessToken(user.id);
    const refreshToken = await this.authService.generateRefreshToken(user.id);

    // Store refresh token in the database
    await this.usersService.setRefreshToken(user.id, refreshToken);

    // Assuming user.roles contains the roles of the user
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        roles: [UserRole.CUSTOMER],
      }, // Include the roles in the response
    };
  }

  @Mutation(() => RefreshTokenResponse)
  @UseGuards(RefreshAuthGuard)
  async refreshToken(
    @RequestSub() { sub, refreshToken }: { sub: string; refreshToken: string }, // Use the RequestSub decorator to get both sub and refreshToken
  ): Promise<RefreshTokenResponse> {
    console.log('refreshTokenInput', refreshToken);
    try {
      return this.authService.refreshToken(sub, refreshToken);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
  // @Mutation(() => AuthResponse)
  // async login(@Args('input') loginInput: LoginInput): Promise<AuthResponse> {
  //   return this.usersService.login(loginInput);
  // }

  @Mutation(() => AuthResponse)
  async socialLogin(
    @Args('input') socialLoginInput: SocialLoginInput,
  ): Promise<AuthResponse> {
    console.log('socialLoginInput', socialLoginInput);

    const userData = await this.authService.validateSocialToken(
      socialLoginInput.provider,
      socialLoginInput.accessToken,
    );

    // Set the source based on the provider
    let source: UserSource; // Declare the source variable
    if (socialLoginInput.provider === 'google') {
      source = UserSource.Google; // Set source to Google
    } else if (socialLoginInput.provider === 'facebook') {
      source = UserSource.Facebook; // Set source to Facebook
    } else {
      throw new UnauthorizedException('Unsupported provider'); // Handle unsupported providers
    }

    // Register the user in the database
    const user = await this.authService.registerSocialUser({
      // firstName: profile.given_name,
      // lastName: profile.family_name,
      picture: userData.picture,
      verified: true,
      status: UserStatus.Verified,
      source, // Set source based on provider
      // googleData: {
      //   token: socialLoginInput.accessToken,
      // },
      email: userData.email,
      name: userData.name,
      // Add any other necessary fields from userData
      roles: [UserRole.CUSTOMER],
    });
    // const user = await this.authService.validateGoogleUser(userData.email);
    // Then generate token for validated user
    const accessToken = await this.authService.generateAccessToken(user.id);
    const refreshToken = await this.authService.generateRefreshToken(user.id);

    // Store refresh token in the database
    await this.usersService.setRefreshToken(user.id, refreshToken);

    // Assuming user.roles contains the roles of the user
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        roles: [UserRole.CUSTOMER],
      }, // Include the roles in the response
    };
  }

  @Mutation(() => AuthResponse)
  async otpLogin(
    @Args('input') otpLoginInput: OtpLoginInput,
  ): Promise<AuthResponse> {
    console.log('otpLoginInput', otpLoginInput);
    return {
      accessToken: 'jwt token',
      refreshToken: 'jwt token',
      // permissions: ['super_admin', 'customer'],
      user: {
        id: '1',
        email: 'john@example.com',
        roles: [UserRole.CUSTOMER],
      },
    };
  }

  @Mutation(() => SuccessResponse)
  async verifyOtpCode(
    @Args('input') verifyOtpInput: VerifyOtpInput,
  ): Promise<SuccessResponse> {
    console.log('verifyOtpInput', verifyOtpInput);
    return {
      message: 'success',
      success: true,
    };
  }

  @Mutation(() => OtpResponse)
  async sendOtpCode(@Args('input') otpInput: OtpInput): Promise<OtpResponse> {
    console.log('otpInput', otpInput);
    return {
      message: 'success',
      success: true,
      id: '1',
      provider: 'google',
      phone_number: '+919494949494',
      is_contact_exist: true,
    };
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async logout(@CurrentUser() user: User): Promise<boolean> {
    await this.authService.invalidateToken(user);
    return true;
  }

  @Mutation(() => PasswordChangeResponse)
  async changePassword(
    @Args('input') changePasswordInput: ChangePasswordInput,
  ): Promise<PasswordChangeResponse> {
    return this.authService.changePassword(changePasswordInput);
  }

  @Mutation(() => PasswordChangeResponse)
  async forgetPassword(
    @Args('input') forgetPasswordInput: ForgetPasswordInput,
  ): Promise<PasswordChangeResponse> {
    return this.authService.forgetPassword(forgetPasswordInput);
  }

  @Mutation(() => PasswordChangeResponse)
  async verifyForgetPasswordToken(
    @Args('input')
    verifyForgetPasswordTokenInput: VerifyForgetPasswordTokenInput,
  ): Promise<PasswordChangeResponse> {
    return this.authService.verifyForgetPasswordToken(
      verifyForgetPasswordTokenInput,
    );
  }

  @Mutation(() => SuccessResponse)
  async resendVerificationEmail() {
    return {
      message: 'success',
      success: true,
    };
  }

  @Mutation(() => SuccessResponse)
  async updateUserEmail(
    @Args('input') updateEmailUserInput: UpdateEmailUserInput,
  ): Promise<SuccessResponse> {
    return {
      message: 'success',
      success: true,
    };
  }

  @Mutation(() => PasswordChangeResponse)
  async resetPassword(
    @Args('input')
    resetPasswordInput: ResetPasswordInput,
  ): Promise<PasswordChangeResponse> {
    return this.authService.resetPassword(resetPasswordInput);
  }
}

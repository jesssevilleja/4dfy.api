import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { UserRole } from 'src/common/interfaces/user.interface';
import { User } from 'src/users/schema/user.schema';

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

// @InputType()
// export class LoginInput extends PartialType(
//   PickType(User, ['email', 'password']),
// ) {}

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => User)
  user: User;
}

@ObjectType()
export class LogoutResponse {
  @Field()
  success: boolean;
}

@ObjectType()
export class RefreshTokenResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}

@InputType()
export class RefreshTokenInput {
  @Field()
  @IsNotEmpty()
  refreshToken: string;
}

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => User)
  user?: {
    id: string;
    email: string;
    roles: [UserRole];
  };
}

@InputType()
export class SocialLoginInput {
  @Field()
  provider: string;

  @Field()
  accessToken: string;
}

@InputType()
export class ChangePasswordInput {
  @Field()
  oldPassword: string;

  @Field()
  newPassword: string;
}

@InputType()
export class ForgetPasswordInput {
  @Field()
  email: string;
}

@InputType()
export class UpdateEmailUserInput {
  @Field()
  email: string;
}

@InputType()
export class VerifyForgetPasswordTokenInput {
  @Field()
  email: string;

  @Field()
  token: string;
}

@InputType()
export class ResetPasswordInput {
  @Field()
  email: string;

  @Field()
  token: string;

  @Field()
  password: string;
}

@ObjectType()
export class PasswordChangeResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}

@InputType()
export class VerifyOtpInput {
  @Field()
  otp_id: string;

  @Field()
  code: string;

  @Field()
  phone_number: string;
}

@ObjectType()
export class OtpResponse {
  @Field()
  id: string;

  @Field()
  message: string;

  @Field()
  success: boolean;

  @Field()
  phone_number: string;

  @Field()
  provider: string;

  @Field()
  is_contact_exist: boolean;
}

@InputType()
export class OtpInput {
  @Field()
  phone_number: string;
}

@InputType()
export class OtpLoginInput {
  @Field()
  otp_id: string;

  @Field()
  code: string;

  @Field()
  phone_number: string;

  @Field()
  name?: string;

  @Field()
  email?: string;
}

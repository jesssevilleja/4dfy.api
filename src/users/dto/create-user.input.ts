import {
  InputType,
  ObjectType,
  PartialType,
  PickType,
  registerEnumType,
} from '@nestjs/graphql';
import { UserRole, UserSource } from 'src/common/interfaces/user.interface';
import { User } from '../schema/user.schema';

registerEnumType(UserRole, { name: 'UserRole' });
@InputType()
export class RegisterUserInput extends PickType(User, [
  'name',
  'email',
  'password',
]) {
  roles: UserRole = UserRole.CUSTOMER;
}
@ObjectType()
export class RegisterUserOutput {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export class CreateUserInput extends PickType(User, [
  'name',
  'email',
  'firstName',
  'lastName',
  'picture',
]) {
  roles: UserRole[] = [UserRole.CUSTOMER];
  source: UserSource = UserSource.Email;
  password?: string;
  verified?: boolean;
  status?: string;
}

@ObjectType()
export class CreateUserOutput {
  id: string;
  name: string;
  status: string;
  source: string;
  roles: UserRole[];
}

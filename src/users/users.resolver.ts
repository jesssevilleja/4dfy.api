import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UpdateUserInput } from './dto/update-user.input';
import { GetUserArgs } from './dto/get-user.args';
import { GetUsersArgs, UserPaginator } from './dto/get-users.args';
import { SuccessResponse } from 'src/common/dto/success-response.model';
import { ProfileInput } from './dto/create-profile.input';
import { Profile } from './entities/profile.entity';
import { UpdateProfileArgs } from './dto/update-profile.args';
import { MakeOrRevokeAdminInput } from './dto/make-revoke-admin.input';
import { GetUserPermissionArgs } from './dto/get-user-permission-.args';
import { GetMyStaffsArgs } from './dto/get-my-staffs.args';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { GqlAuthGuard } from 'src/common/guards/gql-auth.guard';
import { User } from './schema/user.schema';
import { IUser } from './interface/user.interface';
import { RegisterUserInput, RegisterUserOutput } from './dto/create-user.input';
import { AuthService } from 'src/auth/auth.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // @Mutation(() => AuthResponse)
  // async register(
  //   @Args('input') createUserInput: RegisterUserInput,
  // ): Promise<AuthResponse> {
  //   return this.usersService.register(createUserInput);
  // }

  // @Query(() => UserPaginator, { name: 'users' })
  // async getUsers(@Args() getUsersArgs: GetUsersArgs): Promise<UserPaginator> {
  //   return this.usersService.getUsers(getUsersArgs);
  // }

  // @Query(() => UserPaginator, { name: 'usersByPermission' })
  // async getUsersByPermission(
  //   @Args() getUserPermissionArgs: GetUserPermissionArgs,
  // ): Promise<UserPaginator> {
  //   return this.usersService.getUserPermission(getUserPermissionArgs);
  // }

  // @Query(() => UserPaginator, { name: 'usersByPermission' })
  // async getUsersByPermission(@Args() getUserPermissionArgs: GetUserPermissionArgs): Promise<UserPaginator> {
  //   return this.usersService.getUserPermission(getUserPermissionArgs);
  // }

  // @Query(() => User, { name: 'me' })
  // async me(): Promise<User> {
  //   return this.usersService.me();
  // }
  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: User) {
    return user;
  }

  @Query(() => User, { name: 'user', nullable: true })
  async getUser(@Args() getUserArgs: GetUserArgs): Promise<IUser> {
    return await this.usersService.getUser(getUserArgs);
  }

  @Mutation(() => User)
  updateUser(@Args('input') updateUserInput: UpdateUserInput) {
    return this.usersService.updateUser(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  activeUser(@Args('id', { type: () => ID }) id: string) {
    console.log('activeUser', id);
    // return this.usersService.getUsers(updateUserInput.id);
  }

  @Mutation(() => User)
  banUser(@Args('id', { type: () => ID }) id: string) {
    return this.usersService.banUser(id);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => ID }) id: number) {
    return this.usersService.remove(id);
  }

  @Mutation(() => Profile)
  createProfile(@Args('input') profileInput: ProfileInput) {
    console.log('profileInput', profileInput);
  }

  @Mutation(() => Profile)
  updateProfile(@Args() updateProfileArgs: UpdateProfileArgs) {
    console.log('updateProfileArgs', updateProfileArgs);
  }

  @Mutation(() => Profile)
  deleteProfile(@Args('id', { type: () => ID }) id: number) {
    return this.usersService.remove(id);
  }

  @Mutation(() => Boolean)
  async makeOrRevokeAdmin(
    @Args('input') makeOrRevokeAdminInput: MakeOrRevokeAdminInput,
  ) {
    return this.usersService.makeOrRevokeAdmin(makeOrRevokeAdminInput);
  }

  @Mutation(() => Boolean)
  async subscribeToNewsletter(
    @Args('email', { type: () => String }) email: string,
  ) {
    return this.usersService.subscribeToNewsletter(email);
  }

  // @Query(() => UserPaginator, { name: 'myStaffs' })
  // async getMyStaffs(
  //   @Args() getMyStaffsArgs: GetMyStaffsArgs,
  // ): Promise<UserPaginator> {
  //   return this.usersService.getMyStaffs(getMyStaffsArgs);
  // }

  @Mutation(() => Boolean)
  async licenseKeyValidation(
    @Args('license_key', { type: () => String }) license_key: string,
  ) {
    return this.usersService.licenseKeyValidation(license_key);
  }
}

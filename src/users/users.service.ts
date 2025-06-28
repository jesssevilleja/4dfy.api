import { Injectable } from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
// import { v4 as uuidv4 } from 'uuid';
import { GetUserArgs } from './dto/get-user.args';
// import usersJson from './users.json';
// import Fuse from 'fuse.js';
// import { paginate } from 'src/common/pagination/paginate';
// import { plainToClass } from 'class-transformer';
// import { UserPaginator } from './dto/get-users.args';
import { MakeOrRevokeAdminInput } from './dto/make-revoke-admin.input';
// import { GetUserPermissionArgs } from './dto/get-user-permission-.args';
// import { GetMyStaffsArgs } from './dto/get-my-staffs.args';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schema/user.schema';
import { IUser } from './interface/user.interface';
import { RegisterUserInput } from './dto/create-user.input';

// const users = plainToClass(User, usersJson);
// const options = {
//   keys: ['name', 'type.slug', 'categories.slug', 'status'],
//   threshold: 0.3,
// };
// const fuse = new Fuse(users, options);

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<UserDocument>,
  ) {}

  // private users: User[] = users;

  // async register(createUserInput: RegisterUserInput): Promise<AuthResponse> {
  //   const user: User = {
  //     ...users[0],
  //     id: uuidv4() as any,
  //     ...createUserInput,
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   };

  //   this.users.push(user);
  //   return {
  //     token: 'jwt token',
  //     permissions: ['super_admin', 'customer'],
  //   };
  // }

  async registerUser(registerInput: RegisterUserInput): Promise<User> {
    const { password, ...rest } = registerInput;
    const hashedPassword = await bcrypt.hash(password, 10);

    const registerUser = new this.usersModel({
      ...rest,
      password: hashedPassword,
    });

    return await registerUser.save();
  }

  async createUser(createUserInput: IUser): Promise<User> {
    const { password, ...rest } = createUserInput;
    console.log('createUserInput', createUserInput);
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    const registerUser = new this.usersModel({
      ...rest,
      ...(hashedPassword ? { password: hashedPassword } : {}),
    });

    return await registerUser.save();
  }

  async setRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    const hashedRefreshToken = refreshToken
      ? await bcrypt.hash(refreshToken, 10)
      : null;

    await this.usersModel.updateOne(
      { _id: userId },
      { refreshToken: hashedRefreshToken },
    );
  }

  async validateRefreshToken(
    userRefreshToken: string,
    refreshToken: string,
  ): Promise<boolean> {
    if (!userRefreshToken) return false;
    return bcrypt.compare(refreshToken, userRefreshToken);
  }

  getStoreNoticeReceiver(type: string) {
    // const data: User[] = this.users;
    // return data;
  }

  async findUserById(id: string): Promise<User> {
    return this.usersModel.findById(id);
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.usersModel.findOne({ email });
  }

  // async getUsers({ text, first, page }: GetUsersArgs): Promise<UserPaginator> {
  //   const startIndex = (page - 1) * first;
  //   const endIndex = page * first;
  //   let data: User[] = this.users;
  //   if (text?.replace(/%/g, '')) {
  //     data = fuse.search(text)?.map(({ item }) => item);
  //   }
  //   const results = data.slice(startIndex, endIndex);
  //   return {
  //     data: results,
  //     paginatorInfo: paginate(data.length, page, first, results.length),
  //   };
  // }

  // getUserPermission({ permission }: GetUserPermissionArgs): User {
  //   // let data: User[] = this.users;

  //   return User[0];
  // }

  // async getUserPermission({  first, page }: GetUserPermissionArgs): Promise<UserPaginator> {
  //   const startIndex = (page - 1) * first;
  //   const endIndex = page * first;
  //   let data: User[] = this.users;
  //   const results = data.slice(startIndex, endIndex);
  //   return {
  //     data: results,
  //     paginatorInfo: paginate(data.length, page, first, results.length),
  //   };
  // }

  async getUser(GetUserArgs: GetUserArgs): Promise<User> {
    const user = await this.usersModel.findById(GetUserArgs.id);
    return { id: user._id, ...user };
  }

  // public getUsers(getUserArgs: GetUserArgs): User {
  //   return this.users.find((user) => user.id === getUserArgs.id);
  // }

  // me(): User {
  //   return this.users[0];
  // }

  updateUser(id: number, updateUserInput: UpdateUserInput) {
    //return this.users[0];
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async makeOrRevokeAdmin({ user_id }: MakeOrRevokeAdminInput) {
    return true;
  }

  async subscribeToNewsletter(email: string) {
    return true;
  }

  async banUser(id: string) {
    //return this.users.find((u) => u.id === id);
  }

  // async getMyStaffs({  first, page }: GetMyStaffsArgs): Promise<UserPaginator> {
  //   const startIndex = (page - 1) * first;
  //   const endIndex = page * first;
  //   let data: User[] = this.users;
  //   const results = data.slice(startIndex, endIndex);
  //   return {
  //     data: results,
  //     paginatorInfo: paginate(data.length, page, first, results.length),
  //   };
  // }
  async licenseKeyValidation(license_key: string) {
    return true;
  }
}

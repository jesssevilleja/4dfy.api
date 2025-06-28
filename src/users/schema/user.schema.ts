import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType, ID, InputType } from '@nestjs/graphql';
import mongoose, { Document } from 'mongoose';
import {
  UserSource,
  UserRole,
  UserStatus,
} from 'src/common/interfaces/user.interface';
import { IsEmail, MinLength } from 'class-validator';
import { Profile } from '../entities/profile.entity';
import { Address } from 'src/addresses/entities/address.entity';
import { Shop } from 'src/shops/entities/shop.entity';
import { Refund } from 'src/refunds/entities/refund.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Wallet } from 'src/wallets/entities/wallet.entity';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
@InputType('UserInputType', { isAbstract: true })
@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Prop({ required: true, unique: true })
  @Field()
  @IsEmail()
  email: string;

  @Prop({ required: false })
  @Field()
  @MinLength(6)
  password: string;

  @Prop({ type: Boolean, default: false })
  verified: boolean;

  @Prop({
    type: String,
    enum: Object.values(UserStatus),
    default: UserStatus.None,
    trim: true,
  })
  status: UserStatus;

  @Prop({ required: true })
  @Field()
  name: string;

  @Prop()
  @Field({ nullable: true })
  picture: string;

  @Prop()
  @Field({ nullable: true })
  firstName?: string;

  @Prop()
  @Field({ nullable: true })
  lastName?: string;

  @Prop({ default: [UserRole.CUSTOMER] })
  @Field(() => [UserRole])
  roles: UserRole[];

  @Prop({
    type: String,
    enum: Object.values(UserSource),
    default: UserSource.None,
  })
  source: UserSource;

  @Prop({ type: mongoose.Schema.Types.Mixed, required: false, select: false })
  facebookData: any;

  @Prop({ type: mongoose.Schema.Types.Mixed, required: false, select: false })
  googleData: any;

  @Prop({ type: mongoose.Schema.Types.Mixed, required: false, select: false })
  appleData: any;

  @Prop({ type: Date })
  lastLoggedIn: Date;

  @Prop({ type: Object, default: {} })
  @Field(() => Profile)
  profile?: Profile;

  @Prop({ type: [{ type: Object, _id: true }], default: [] })
  @Field(() => [Address])
  address?: Address[];

  @Prop({ type: Object, default: {} })
  @Field(() => Wallet)
  wallet?: Wallet;

  @Prop()
  @Field(() => [Order])
  orders?: Order[];

  @Prop({ type: Object, default: {} })
  @Field(() => Order)
  last_order?: Order;

  // @Prop()
  // @Field(() => ID)
  // shop_id?: number;

  // @Prop()
  // @Field(() => [Shop])
  // shops?: Shop[];

  // @Prop()
  // @Field(() => [Refund])
  // refunds?: Refund[];

  // @Prop()
  // @Field(() => Shop)
  // managed_shop?: Shop;

  // @Prop()
  // @Field(() => [Permissions])
  // permissions: Permissions[];

  @Prop({ default: null })
  refreshToken: string;

  @Prop()
  @Field()
  createdAt: Date;

  @Prop()
  @Field()
  updatedAt: Date;
}

@InputType('CustomerInputType', { isAbstract: true })
@ObjectType()
export class Customer {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  @IsEmail()
  email: string;
  // Other fields as necessary
}

export const UserSchema = SchemaFactory.createForClass(User);

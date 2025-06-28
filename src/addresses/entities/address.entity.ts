import { InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { GoogleMapLocation } from 'src/settings/entities/setting.entity';
import { User } from 'src/users/schema/user.schema';
import { Field, ID } from '@nestjs/graphql';

export enum AddressType {
  BILLING = 'billing',
  SHIPPING = 'shipping',
}

registerEnumType(AddressType, { name: 'AddressType' });

@InputType('UserAddressInputType', { isAbstract: true })
@ObjectType()
export class UserAddress {
  @Field(() => String, { nullable: true })
  street_address?: string;

  @Field(() => String, { nullable: true })
  country?: string;

  @Field(() => String, { nullable: true })
  city?: string;

  @Field(() => String, { nullable: true })
  state?: string;

  @Field(() => String, { nullable: true })
  zip?: string;
}

@InputType('AddressInputType', { isAbstract: true })
@ObjectType()
export class Address {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => Boolean, { nullable: true })
  default?: boolean;

  @Field(() => UserAddress, { nullable: true })
  address?: UserAddress;

  @Field(() => GoogleMapLocation, { nullable: true })
  location?: GoogleMapLocation;

  @Field(() => AddressType, { nullable: true })
  type?: AddressType;

  @Field(() => User, { nullable: true })
  customer?: User;
}

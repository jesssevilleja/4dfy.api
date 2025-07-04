// import { ObjectType, InputType, Field, ID } from '@nestjs/graphql';
// import { Address } from 'src/addresses/entities/address.entity';
// import { CoreEntity } from 'src/common/entities/core.entity';
// import { Order } from 'src/orders/entities/order.entity';
// import { Refund } from 'src/refunds/entities/refund.entity';
// import { Shop } from 'src/shops/entities/shop.entity';
// import { Wallet } from 'src/wallets/entities/wallet.entity';
// import { Profile } from './profile.entity';

// @InputType('UserInputType', { isAbstract: true })
// @ObjectType()
// export class User extends CoreEntity {
//   name: string;
//   first_name?: string;
//   last_name?: string;
//   email: string;
//   password?: string;
//   shop_id?: number;
//   profile?: Profile;
//   shops?: Shop[];
//   refunds?: Refund[];
//   managed_shop?: Shop;
//   is_active?: boolean = true;
//   address?: Address[];
//   orders?: Order[];
//   wallet?: Wallet;
//   permissions: Permissions[];
//   roles: string[];
//   last_order?: Order;
// }

// @InputType('PermissionsInputType', { isAbstract: true })
// @ObjectType()
// export class Permissions {
//   @Field(() => ID)
//   id: string;
//   name: string;
// }

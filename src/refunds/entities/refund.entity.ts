import { Field, ID, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Attachment } from 'src/common/entities/attachment.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Order } from 'src/orders/entities/order.entity';
import { RefundReason } from 'src/refund-reason/entities/refund-reason.entity';
import { Shop } from 'src/shops/entities/shop.entity';
import { User } from 'src/users/schema/user.schema';

export enum RefundStatus {
  APPROVED = 'Approved',
  PENDING = 'Pending',
  REJECTED = 'Rejected',
  PROCESSING = 'Processing',
}
registerEnumType(RefundStatus, { name: 'RefundStatus' });
@InputType('RefundInputType', { isAbstract: true })
@ObjectType()
export class Refund extends CoreEntity {
  title: string;
  description: string;
  images?: Attachment[];
  amount: string;
  status?: RefundStatus;
  shop?: Shop;
  order?: Order;
  customer?: User;
  @Field(() => ID)
  refund_reason_id: number;
  refund_reason?:RefundReason;
}

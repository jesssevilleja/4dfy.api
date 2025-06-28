import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';

@InputType('WalletInputType', { isAbstract: true })
@ObjectType()
export class Wallet {
  @Field(() => Int)
  total_points: number = 0;
  @Field(() => Int)
  points_used: number = 0;
  @Field(() => Int)
  available_points: number = 0;
}

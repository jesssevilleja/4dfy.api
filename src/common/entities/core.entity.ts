import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Type } from 'class-transformer';

@ObjectType()
export class CoreEntity {
  @Field(() => ID)
  id?: string;
  @Type(() => Date)
  createdAt?: Date;
  @Type(() => Date)
  updatedAt?: Date;
}

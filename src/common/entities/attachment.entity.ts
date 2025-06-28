import { ObjectType, InputType, ID, Field } from '@nestjs/graphql';

@InputType('AttachmentInput', { isAbstract: true })
@ObjectType()
export class Attachment {
  @Field(() => ID, { nullable: true })
  id?: string;
  @Field()
  thumbnail?: string;
  @Field({ nullable: true })
  original?: string;
}
@InputType() // Only InputType for input
@ObjectType()
export class AttachmentInput {
  @Field({ nullable: true })
  thumbnail?: string;

  @Field({ nullable: true })
  original?: string;
}
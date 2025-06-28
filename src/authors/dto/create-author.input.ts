import { Field, ID, InputType, OmitType } from '@nestjs/graphql';
import { Author } from '../entities/author.entity';

@InputType()
export class CreateAuthorInput extends OmitType(Author, [
  'id',
  'createdAt',
  'updatedAt',
  'translated_languages',
]) {
  @Field(() => ID)
  shop_id?: number;
}

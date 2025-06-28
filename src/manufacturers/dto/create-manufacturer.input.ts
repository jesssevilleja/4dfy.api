import { Field, ID, InputType, OmitType } from '@nestjs/graphql';
import { Manufacturer } from '../entities/manufacturer.entity';

@InputType()
export class CreateManufacturerInput extends OmitType(Manufacturer, [
  'id',
  'createdAt',
  'updatedAt',
  'type',
  'translated_languages',
]) {
  @Field(() => ID)
  shop_id?: number;
}

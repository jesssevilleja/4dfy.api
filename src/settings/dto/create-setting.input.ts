import { InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { CoreMutationOutput } from 'src/common/dto/core-mutation-output.model';
import { Settings } from '../entities/setting.entity';

@InputType()
export class CreateSettingsInput extends OmitType(Settings, [
  'createdAt',
  'updatedAt',
]) {}
@InputType()
export class ContactInput {
  subject: string;
  email: string;
  name: string;
  description: string;
}

@ObjectType()
export class ContactResponse extends CoreMutationOutput {}

import { ArgsType, Field, ID } from '@nestjs/graphql';
import { CoreGetArguments } from 'src/common/dto/core-get-arguments.args';

@ArgsType()
export class GetRefundPolicyArgs extends CoreGetArguments {
  @Field(() => ID)
  id?: string;
  slug?: string;
  language?: string;
}

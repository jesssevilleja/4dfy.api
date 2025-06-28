import { ArgsType, Field, ID } from '@nestjs/graphql';

@ArgsType()
export class CoreGetArguments {
  @Field(() => ID)
  id?: string;
  slug?: string;
}

import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Campaign {
  @Field(() => String)
  name: string;
}

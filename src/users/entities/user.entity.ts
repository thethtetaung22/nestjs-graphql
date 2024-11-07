import { ObjectType, Field, ID, GraphQLISODateTime } from '@nestjs/graphql';
import { v4 as uuidv4 } from 'uuid';

@ObjectType()
export class User {
  @Field(() => ID, { description: 'id' })
  _id: string;

  @Field(() => String, { description: 'Name' })
  name: string;

  @Field(() => String, { description: 'Email' })
  email: string;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}

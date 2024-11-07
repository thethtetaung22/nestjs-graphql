import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCampaignInput {
  @Field(() => String, { description: 'Example field (placeholder)' })
  playerId: string;

  @Field(() => String, { description: 'Example field (placeholder)' })
  name: string;
}

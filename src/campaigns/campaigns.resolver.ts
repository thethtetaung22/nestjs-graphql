import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { CampaignsService } from './campaigns.service';
import { Campaign } from './entities/campaign.entity';
import { CreateCampaignInput } from './dto/create-campaign.input';
import { UpdateCampaignInput } from './dto/update-campaign.input';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver(() => Campaign)
export class CampaignsResolver {
  constructor(private readonly campaignsService: CampaignsService) { }

  @Mutation(() => Campaign)
  async createCampaign(@Args('createCampaignInput') createCampaignInput: CreateCampaignInput) {
    const campaign = new Campaign();
    campaign.name = createCampaignInput.name;
    await pubSub.publish(`campaignAdded#${createCampaignInput.playerId}`, { campaignAdded: campaign });
    return campaign;
    return this.campaignsService.create(createCampaignInput);
  }

  @Query(() => [Campaign], { name: 'campaigns' })
  findAll() {
    return this.campaignsService.findAll();
  }

  @Query(() => Campaign, { name: 'campaign' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.campaignsService.findOne(id);
  }

  @Mutation(() => Campaign)
  updateCampaign(@Args('updateCampaignInput') updateCampaignInput: UpdateCampaignInput) {
    return this.campaignsService.update(updateCampaignInput.id, updateCampaignInput);
  }

  @Mutation(() => Campaign)
  removeCampaign(@Args('id', { type: () => String }) id: string) {
    return this.campaignsService.remove(id);
  }

  @Subscription(() => Campaign)
  campaignAdded(@Args('id', { type: () => String }) id: string): AsyncIterator<Campaign> {
    console.log('Id:', id);
    return pubSub.asyncIterator(`campaignAdded#${id}`);
  }
}

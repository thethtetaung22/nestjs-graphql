import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { MongooseModule } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

const clientsMap = new Map<string, { id: string; connectedAt: Date }>();

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest'),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      subscriptions: {
        'subscriptions-transport-ws': {
          onConnect: async (connectionParams, webSocket, context) => {
            console.log(connectionParams);
            const initPromise = await context.initPromise;
            console.log(context);
            // console.log('Client connected', Object.keys(webSocket));
            // console.log('Client connected: SOcket', webSocket._socket);
            const uniqueKey = uuidv4(); // Generate a unique key for the client
            const clientInfo = {
              id: uniqueKey,
              connectedAt: new Date(),
            };

            // Store client info in a Map or database
            clientsMap.set(uniqueKey, clientInfo);
            // console.log('ClientMap:', clientsMap);

            console.log(`Client connected with key: ${uniqueKey}`);
            return { uniqueKey };
          },
          onDisconnect: async (webSocket, context) => {
            console.log('onDisconnect:');
            const initPromise = await context.initPromise;
            console.log(initPromise);
            const uniqueKey = initPromise?.uniqueKey;
            if (uniqueKey) {
              clientsMap.delete(uniqueKey); // Remove client info on disconnect
              console.log(`Client disconnected with key: ${uniqueKey}`);
              // console.log('ClientMap:', clientsMap);
            }
          },
          keepAlive: 10000, // Ping every 10 seconds to ensure connection is active
        },
      },
      playground: true,  // Enable Playground
      introspection: true,  // Allow schema introspection
    }),
    UsersModule,
    CampaignsModule,
  ],
  controllers: [AppController],
  providers: [AppService,],
})
export class AppModule { }

import { ConfigService } from '@nestjs/config';
import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (
      configService: ConfigService,
    ): Promise<typeof mongoose> => {
      try {
        const uri = configService.get<string>('DB_URL');
        if (!uri) {
          throw new Error('DB URL is not defined in the environment variables');
        }
        return await mongoose.connect(uri);
      } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
      }
    },
    inject: [ConfigService],
  },
];

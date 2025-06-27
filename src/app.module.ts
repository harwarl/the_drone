import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DroneModule } from './drone/drone.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { ENV_FILE_PATH } from 'utils/constants';
import { MedicationModule } from './medication/medication.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
      }),
      envFilePath: ENV_FILE_PATH,
    }),
    DroneModule,
    DatabaseModule,
    MedicationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

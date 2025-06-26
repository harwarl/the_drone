import { Connection } from 'mongoose';
import { DroneSchema } from '../schema/drone.schema';

export const dronesProviders = [
  {
    provide: 'DRONE_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Drone', DroneSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];

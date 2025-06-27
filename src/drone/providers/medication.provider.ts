import { Connection } from 'mongoose';
import { MedicationSchema } from '../schema/medication.schema';

export const medicationsProviders = [
  {
    provide: 'MEDICATION_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Medication', MedicationSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];

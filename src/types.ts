enum STATE {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
  DELIVERING = 'DELIVERING',
  DELIVERED = 'DELIVERED',
  RETURNING = 'RETURNING',
}

enum MODEL {
  LIGHTWEIGHT = 'lightweight',
  MIDDLEWEIGHT = 'middleweight',
  CRUISERWEIGHT = 'cruiserweight',
  HEAVYWEIGHT = 'heavyweight',
}

enum WEIGHTS {
  LIGHTWEIGHT = 100,
  MIDDLEWEIGHT = 250,
  CRUISERWEIGHT = 400,
  HEAVYWEIGHT = 500,
}

interface Drone {
  serial_number: string;
  model: MODEL;
  weight_limit: WEIGHTS;
  no_of_medications: number;
  current_load_weight: number;
  battery_level: number;
  state: STATE;
}

interface Medication {
  droneId: string;
  name: string;
  weight: number;
  code: string;
  image_url: string;
  destination: string;
  status: MEDICATION_STATUS;
}

enum MEDICATION_STATUS {
  DELIVERED = 'delivered',
  IN_PROGRESS = 'in_progress',
}

type DroneQuery = {
  serial_number?: string;
  droneId?: string;
};

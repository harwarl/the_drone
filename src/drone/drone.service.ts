import {
  Injectable,
  Inject,
  Query,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { RegisterDroneDto } from './dto/registerDrone.dto';
import { LoadDroneDto } from './dto/loadDrone.dto';

@Injectable()
export class DroneServiceV1 {
  constructor(
    @Inject('DRONE_MODEL') private droneModel: Model<Drone>,
    @Inject('MEDICATION_MODEL') private medicationModel: Model<Medication>,
  ) {}

  // Get all drones
  async getAllDrones(params: Partial<Drone>) {
    const query: any = {};

    // Filter by state
    if (params.state) {
      query.state = params.state;
    }

    // Filter by battery level
    if (params.battery_level) {
      query.battery_level = {};
      if (typeof params.battery_level['lt'] !== 'undefined') {
        query.battery_level.$lt = Number(params.battery_level['lt']);
      }
      if (typeof params.battery_level['gt'] !== 'undefined') {
        query.battery_level.$gt = Number(params.battery_level['gt']);
      }
    }

    // Filter by load weights
    if (params.current_load_weight) {
      query.current_load_weight = {};
      if (typeof params.current_load_weight['lt'] !== 'undefined') {
        query.current_load_weight.$lt = Number(
          params.current_load_weight['lt'],
        );
      }
      if (typeof params.current_load_weight['gt'] !== 'undefined') {
        query.current_load_weight.$gt = Number(
          params.current_load_weight['gt'],
        );
      }
    }

    const drones = await this.getDrones(query);
    return drones;
  }

  async registerDrone(registerDroneDto: RegisterDroneDto) {
    // Check if the number of drones exceeds 10
    const drones = await this.getDrones();
    if (drones.length >= 10) {
      throw new BadRequestException('Cannot register more than 10 drones.');
    }

    const model = registerDroneDto.model;

    // Check if drone model is registered
    if (!(model in MODEL) || !(model in WEIGHTS)) {
      throw new BadRequestException(
        'Invalid drone model or weight configuration',
      );
    }

    let newDrone: Drone = {
      serial_number: registerDroneDto.serial_number,
      model: MODEL[registerDroneDto.model],
      weight_limit: WEIGHTS[registerDroneDto.model],
      no_of_medications: 0,
      current_load_weight: 0,
      battery_level: registerDroneDto.battery_level,
      state: STATE.IDLE,
    };

    return await this.droneModel.create(newDrone);
  }

  // Load a drone
  async loadDrone(loadDroneDto: LoadDroneDto) {
    // Get the drone
    const drone = await this.getDroneById(loadDroneDto.droneId);
    if (!drone)
      throw new NotFoundException(
        `Drone with ${loadDroneDto.droneId} not found`,
      );

    // Ensure Drone is in loadable state and it has enough battery
    if (
      (drone.state === STATE.IDLE || drone.state === STATE.LOADING) &&
      drone.battery_level < 25
    ) {
      throw new BadRequestException(
        "Can't load drone at the moment, try another drone",
      );
    }

    // Check if total weight would exceed drone's max limit
    const currentWeight = Number(drone.current_load_weight);
    const newWeight = Number(loadDroneDto.weight);
    const totalLoad = currentWeight + newWeight;

    if (totalLoad > drone.weight_limit) {
      // Update the drone state to be loaded
      if (drone.state === STATE.LOADING) {
        drone.state = STATE.LOADED;
        await drone.save();
      }

      throw new BadRequestException(
        'Load exceeds drone weight limit. Choose a lighter package or another drone.',
      );
    }

    // update the states of the drone
    drone.no_of_medications += 1;
    drone.current_load_weight += loadDroneDto.weight;

    if (drone.state === STATE.IDLE) {
      drone.state = STATE.LOADING;
    }

    // Save new medication to DB
    await this.medicationModel.create({
      ...loadDroneDto,
      status: MEDICATION_STATUS.IN_PROGRESS,
    });
    // Update the drone
    await drone.save();

    return {
      drone,
      medication: {
        ...loadDroneDto,
        status: MEDICATION_STATUS.IN_PROGRESS,
      },
    };
  }

  // Get SpecificDrone
  async getSpecificDroneWithMedications(queryParams: DroneQuery) {
    let query = {};

    if (queryParams.droneId) {
      query = { _id: queryParams.droneId };
    }

    if (queryParams.serial_number) {
      query = { serial_number: queryParams.serial_number };
    }

    const drone = await this.getDroneByKey(query);
    if (!drone) throw new NotFoundException('Drone not found');

    // get The medications of the drone
    const medications = await this.getMedicationsByDroneId(
      drone._id.toString(),
    );

    return {
      ...drone,
      medications,
    };
  }

  // Update drone
  async updateDroneState(droneId: string, updates: Partial<Drone>) {
    const drone = await this.getDroneById(droneId);

    if (!drone) {
      throw new NotFoundException(`Drone with ID ${droneId} not found`);
    }

    // Apply updates
    Object.assign(drone, updates);

    await drone.save();

    return drone;
  }

  // Make off medication as received
  async updateMedication(droneId: string, medicationId: string, code: string) {
    const drone = await this.getDroneById(droneId);

    if (!drone) {
      throw new NotFoundException(`Drone with ID ${droneId} not found`);
    }

    const medication = await this.medicationModel.findById(medicationId);

    if (medication)
      throw new NotFoundException(
        `Medication with ID ${medicationId} not found`,
      );

    // check if the code entered is the same as the one already in the database
    if (medication.code !== code)
      throw new BadRequestException('Invalid code entered');

    // Mark Medication as Delivered
    medication.status = MEDICATION_STATUS.DELIVERED;

    // Do the necessary subtractions in the drone
    drone.no_of_medications -= 1;
    drone.current_load_weight -= medication.weight;

    if (drone.no_of_medications === 0) {
      drone.state = STATE.RETURNING;
    } else {
      drone.state = STATE.DELIVERING;
    }

    await drone.save();
    await medication.save();

    return { medication };
  }

  // privates
  private async getDrones(query?: any) {
    return await this.droneModel.find(query);
  }

  private async getMedicationsByDroneId(droneId: string) {
    return await this.medicationModel.find({
      droneId,
    });
  }

  private async getDroneById(droneId: string) {
    return await this.droneModel.findById(droneId);
  }

  private async getDroneByKey(keyQuery: any) {
    return await this.droneModel.findOne(keyQuery);
  }
}

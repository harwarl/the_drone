import {
  IsAlphanumeric,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
} from 'class-validator';

export class RegisterDroneDto {
  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric()
  @MaxLength(100, { message: 'Serial number must not exceed 100 characters' })
  serial_number: string;

  @IsEnum(MODEL, { message: 'Invalid drone model' })
  model: MODEL;

  @IsString()
  @IsNotEmpty()
  @IsNumberString({}, { message: 'Battery level must be numeric' })
  battery_level: number;
}

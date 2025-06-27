import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsUrl,
  Matches,
  MaxLength,
} from 'class-validator';

export class LoadDroneDto {
  @IsString()
  @IsNotEmpty()
  droneId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50, { message: 'Name must not exceed 50 characters' })
  name: string;

  @IsNumber()
  @IsNotEmpty()
  weight: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z0-9_]+$/, {
    message:
      'Code can only contain uppercase letters, numbers, and underscores',
  })
  code: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  image_url: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'Destination must not exceed 100 characters' })
  destination: string;
}

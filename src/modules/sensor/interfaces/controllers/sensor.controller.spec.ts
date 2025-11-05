/* eslint-disable @typescript-eslint/unbound-method */
import { Sensor } from '@domain/entities/sensor.entity';
import { CreateSensorUseCase } from '@modules/sensor/application/use-cases/create-sensor.usecase';
import { CreateSensorDto } from '@modules/sensor/interfaces/dtos/create-sensor.dto';
import { Test, TestingModule } from '@nestjs/testing';

import { SensorController } from './sensor.controller';

describe('SensorController', () => {
  let controller: SensorController;
  let createSensorUseCase: CreateSensorUseCase;

  const mockCreateSensorUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SensorController],
      providers: [
        {
          provide: CreateSensorUseCase,
          useValue: mockCreateSensorUseCase,
        },
      ],
    }).compile();

    controller = module.get<SensorController>(SensorController);
    createSensorUseCase = module.get<CreateSensorUseCase>(CreateSensorUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a sensor successfully', async () => {
      // Arrange
      const createSensorDto: CreateSensorDto = {
        name: 'Temperature Sensor',
        type: 'temperature',
      };

      const expectedSensor: Sensor = {
        id: '123',
        name: 'Temperature Sensor',
        type: 'temperature',
      } as Sensor;

      mockCreateSensorUseCase.execute.mockResolvedValue(expectedSensor);

      // Act
      const result = await controller.create(createSensorDto);

      // Assert
      expect(createSensorUseCase.execute).toHaveBeenCalledWith(
        'Temperature Sensor',
        'temperature',
      );
      expect(result).toEqual(expectedSensor);
    });

    it('should call use case with correct parameters', async () => {
      // Arrange
      const createSensorDto: CreateSensorDto = {
        name: 'Humidity Sensor',
        type: 'humidity',
      };

      const expectedSensor: Sensor = {
        id: '456',
        name: 'Humidity Sensor',
        type: 'humidity',
      } as Sensor;

      mockCreateSensorUseCase.execute.mockResolvedValue(expectedSensor);

      // Act
      await controller.create(createSensorDto);

      // Assert
      expect(createSensorUseCase.execute).toHaveBeenCalledTimes(1);
      expect(createSensorUseCase.execute).toHaveBeenCalledWith(
        'Humidity Sensor',
        'humidity',
      );
    });

    it('should handle errors from use case', async () => {
      // Arrange
      const createSensorDto: CreateSensorDto = {
        name: 'Invalid Sensor',
        type: 'invalid',
      };

      const error = new Error('Failed to create sensor');
      mockCreateSensorUseCase.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.create(createSensorDto)).rejects.toThrow(error);
      expect(createSensorUseCase.execute).toHaveBeenCalledWith(
        'Invalid Sensor',
        'invalid',
      );
    });

    it('should handle empty name and type', async () => {
      // Arrange
      const createSensorDto: CreateSensorDto = {
        name: '',
        type: '',
      };

      const expectedSensor: Sensor = {
        id: '789',
        name: '',
        type: '',
      } as Sensor;

      mockCreateSensorUseCase.execute.mockResolvedValue(expectedSensor);

      // Act
      const result = await controller.create(createSensorDto);

      // Assert
      expect(createSensorUseCase.execute).toHaveBeenCalledWith('', '');
      expect(result).toEqual(expectedSensor);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';

import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { LoggerLevel } from 'src/logger/logger.types';
import { LoggerModule } from '../logger/logger.module';

jest.mock('./course.service');

describe('-- Course Controller --', () => {
  let module: TestingModule;
  let courseController: CourseController;

  beforeAll(async () => {
    const logLevel: LoggerLevel = 'debug';
    module = await Test.createTestingModule({
      imports: [LoggerModule.forRoot({ level: logLevel, silent: true })],
      controllers: [CourseController],
      providers: [CourseService],
    }).compile();

    courseController = module.get(CourseController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should be defined', async () => {
    expect(courseController).toBeDefined();
  });

  test('base method should return instance', async () => {
    expect(courseController.base).toEqual(courseController);
  });
});

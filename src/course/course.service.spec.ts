import { getCustomRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { CourseRepository } from './course.repository';
import { CourseService } from './course.service';
import { LoggerModule } from '../logger/logger.module';
import { LoggerLevel } from 'src/logger/logger.types';

const mockRepository = (): any => ({
  metadata: {
    columns: [],
    relations: [],
  },
  createQueryBuilder: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  save: jest.fn(),
});

describe('-- Course Service --', () => {
  let courseService: CourseService;
  let module: TestingModule;

  afterEach(() => {
    jest.resetAllMocks();
    module.close();
  });

  beforeEach(async () => {
    const logLevel: LoggerLevel = 'debug';
    module = await Test.createTestingModule({
      imports: [LoggerModule.forRoot({ level: logLevel, silent: true })],
      providers: [
        CourseService,
        {
          provide: getCustomRepositoryToken(CourseRepository),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    courseService = await module.get<CourseService>(CourseService);
  });

  it('should be defined', async () => {
    expect(courseService).toBeDefined();
  });
});

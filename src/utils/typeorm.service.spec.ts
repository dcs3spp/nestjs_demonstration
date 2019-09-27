import { Course } from '../course/course.entity';

const repoMock = {
  create: jest.fn(),
  findOne: jest.fn(),
  metadata: {
    columns: [],
    relations: [],
  },
  save: jest.fn(),
  target: Course,
};

const requestMock = {
  options: {},
  parsed: {
    fields: [],
    paramsFilter: [],
    filter: [],
    or: [],
    join: [],
    sort: [],
    limit: 0,
    offset: 0,
    page: 0,
    cache: 0,
  },
};

import { ComparisonOperator } from '@nestjsx/crud-request';
import { CourseRepository } from '../course/course.repository';
import { MyTypeOrmCrudService } from './typeorm.service';
import { Test } from '@nestjs/testing';
import { getCustomRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('-- MyTypeOrmCrudService --', () => {
  let userRepository;
  let service: MyTypeOrmCrudService<Course>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: getCustomRepositoryToken(CourseRepository),
          useValue: repoMock,
        },
      ],
    }).compile();

    userRepository = await module.get<CourseRepository>(CourseRepository);
    service = new MyTypeOrmCrudService<Course>(userRepository);
  });

  test('should be defined when constructed', () => {
    expect(service).toBeInstanceOf(MyTypeOrmCrudService);
    expect(service).toBeDefined();
  });

  test('createOne method saves an entity to repository', async () => {
    const course: Course = new Course(1014761, 'Another Test Course');

    repoMock.findOne.mockResolvedValue(undefined);
    repoMock.save.mockResolvedValue(course);

    await expect(service.createOne(requestMock, course)).resolves.toBe(course);

    expect(repoMock.save).toHaveBeenCalled();
  });

  test('createOne method throws BadRequest exception when undefined data transfer object used', async () => {
    const course: Course = undefined;

    await expect(service.createOne(requestMock, course)).rejects.toThrowError(
      BadRequestException,
    );
  });

  test('createOne method throws ConflictException when attempt is made to save a duplicate', async () => {
    const course: Course = new Course(1014760, 'Test Course');

    repoMock.findOne.mockResolvedValue(course);

    await expect(service.createOne(requestMock, course)).rejects.toThrowError(
      ConflictException,
    );
  });

  test('createOne method saves with filter with parameters matching entity properties', async () => {
    const course: Course = new Course(1014760, 'Test Course');

    const requestWithParamsFilterMock = {
      options: {},
      parsed: {
        fields: [],
        paramsFilter: [
          {
            field: 'CourseID',
            operator: 'eq' as ComparisonOperator,
            value: 1014760,
          },
        ],
        filter: [],
        or: [],
        join: [],
        sort: [],
        limit: 0,
        offset: 0,
        page: 0,
        cache: 0,
      },
    };

    repoMock.findOne.mockResolvedValue(undefined);
    repoMock.save.mockResolvedValue(course);

    await expect(
      service.createOne(requestWithParamsFilterMock, course),
    ).resolves.toBe(course);
  });

  test('createOne method saves with filter on object with additional properties from parameters', async () => {
    const course: Course = new Course(1014760, 'Test Course');

    const requestWithParamsFilterMock = {
      options: {},
      parsed: {
        fields: [],
        paramsFilter: [
          {
            field: 'AdditionalField',
            operator: 'eq' as ComparisonOperator,
            value: 1014760,
          },
        ],
        filter: [],
        or: [],
        join: [],
        sort: [],
        limit: 0,
        offset: 0,
        page: 0,
        cache: 0,
      },
    };

    repoMock.target = jest.fn();
    repoMock.findOne.mockResolvedValue(undefined);
    repoMock.save.mockResolvedValue(course);

    await expect(
      service.createOne(requestWithParamsFilterMock, course),
    ).resolves.toBe(course);
  });
});

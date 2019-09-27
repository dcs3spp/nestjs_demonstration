import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Course } from './course.entity';
import { CourseRepository } from './course.repository';
import { LoggingService } from '../logger/logger.service';
import { MyTypeOrmCrudService } from '../utils/typeorm.service';

@Injectable()
export class CourseService extends MyTypeOrmCrudService<Course> {
  constructor(
    private readonly logger: LoggingService,
    @InjectRepository(CourseRepository)
    private readonly courseRepository: CourseRepository,
  ) {
    super(courseRepository);
  }
}

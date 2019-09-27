import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';

import { Course } from './course.entity';
import { CourseService } from './course.service';
import { LoggingService } from '../logger/logger.service';

@Crud({
  model: {
    type: Course,
  },
  params: {
    id: {
      field: 'CourseID',
      type: 'number',
      primary: true,
    },
  },
  routes: {
    only: [
      'createOneBase',
      'deleteOneBase',
      'getManyBase',
      'getOneBase',
      'updateOneBase',
    ],
  },
})
@Controller('course')
export class CourseController implements CrudController<Course> {
  constructor(
    private readonly logger: LoggingService,
    public service: CourseService,
  ) {}

  /**
   * Provide intellisense, see https://github.com/nestjsx/crud/wiki/Controllers#intellisense
   */
  get base(): CrudController<Course> {
    return this;
  }
}

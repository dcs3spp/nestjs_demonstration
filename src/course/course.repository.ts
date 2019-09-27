import { EntityRepository, Repository } from 'typeorm';
import { Course } from './course.entity';

@EntityRepository(Course)
export class CourseRepository extends Repository<Course> {}

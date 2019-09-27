import { ApiModelProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { IsDefined, IsString, IsNumber } from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('course', { schema: 'coursemanagement' })
export class Course {
  @ApiModelProperty()
  @IsDefined({ groups: [CREATE, UPDATE] })
  @IsNumber({}, { always: true })
  @Column('integer', {
    name: 'CourseID',
    nullable: false,
    primary: true,
  })
  // eslint-disable-next-line camelcase
  public CourseID = 0;

  @ApiModelProperty()
  @IsDefined({ groups: [CREATE, UPDATE] })
  @IsString({ always: true })
  @Column('character varying', {
    length: 50,
    name: 'CourseName',
    nullable: false,
  })
  // eslint-disable-next-line camelcase
  public CourseName = '';

  constructor(courseId: number, courseName: string) {
    this.CourseID = courseId;
    this.CourseName = courseName;
  }
}

export default Course;

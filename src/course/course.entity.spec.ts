import { Course } from './course.entity';

describe('-- Course Entity --', () => {
  describe('constructor', () => {
    const expectCourseID = 1014760;
    const expectCourseName = 'Test Course';

    test('should be initialised', async () => {
      const course: Course = new Course(expectCourseID, expectCourseName);
      expect(course).toBeDefined();
      expect(course.CourseID).toEqual(expectCourseID);
      expect(course.CourseName).toEqual(expectCourseName);
    });
  });
});

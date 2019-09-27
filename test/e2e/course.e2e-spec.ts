import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../../src/app.module';
import { ApplicationOptions } from '../../src/app.interfaces';
import { Course } from '../../src/course/course.entity';

// jest with jest-circus test runner causes exception to be thrown and tests to
// be aborted/failed when beforeEach hook fails.
// with the default jasmine2 test runner it causes a failure with each test continuing.
// these tests use the jest-circus runner, configured in jest-e2e.json

// when app is initialised this is not reflected in the test module state for isInitialized,
// only the app status.
// when the app is closed the isInitialized member is not updated to false.
// when close the test module it calls dispose and shutdown hooks. on the child modules. This does not
// change the state of app module to isInitialized to false.

const { error: testLogger } = console; // keep ts-lint happy

process.stdout.write = jest.fn(); // mock process.stdout.write, prevent a flood of debug messages

describe('-- Course (e2e) --', () => {
  let app: INestApplication;
  let testModule: TestingModule;
  const silentLogging = true;
  const appOptions: ApplicationOptions = {
    seedData: true,
    loggingOptions: { level: 'debug', silent: silentLogging },
  };

  const courseService = {
    findAll: (): Array<Course> => [
      { CourseID: 1014760, CourseName: 'BTEC L3 90 IT' },
      { CourseID: 1015101, CourseName: 'BTEC L2 IT' },
    ],
  };

  async function dispose(): Promise<void> {
    if (testModule) {
      await testModule.close();
    }
  }

  afterEach(async done => {
    try {
      await dispose();
      done();
    } catch (error) {
      testLogger(`afterEach() exception while disposing resources => ${error}`);
    }
  });

  beforeEach(async done => {
    try {
      testModule = await Test.createTestingModule({
        imports: [AppModule.forRoot(appOptions)],
      }).compile();
    } catch (err) {
      testLogger('beforeEach() exception initialising creating test module');
      throw err;
    }

    try {
      app = testModule.createNestApplication();
      await app.init();
    } catch (err) {
      testLogger('beforeEach() exception initialising application');
      try {
        await dispose();
      } catch (innerErr) {
        testLogger(`beforeEach() exception disposing resources => ${err}`);
      }
      throw err;
    }

    done();
  });

  test('should raise HTTP status 404 when unable to locate a route', () => {
    return request(app.getHttpServer())
      .post('/course/unrecognised')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404);
  });

  describe('/course routes', () => {
    test('/course (GET)', () => {
      return request(app.getHttpServer())
        .get('/course')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(courseService.findAll());
    });

    test('/course/:id (GET)', () => {
      return request(app.getHttpServer())
        .get('/course/1014760')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect({ CourseID: 1014760, CourseName: 'BTEC L3 90 IT' });
    });

    test('/course (POST)', () => {
      const courseId = 99999;
      const courseName = 'Test Course';
      const course: Course = new Course(courseId, courseName);

      return request(app.getHttpServer())
        .post('/course')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send(course)
        .expect(201)
        .expect(JSON.stringify(course));
    });

    test('/course (POST)', () => {
      const courseId = 88888;
      const courseName = 'Test Course';
      const course: Course = new Course(courseId, courseName);

      return request(app.getHttpServer())
        .post('/course')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send(course)
        .expect(201)
        .expect(JSON.stringify(course));
    });

    test('/core (PATCH)', () => {
      const courseId = 1014760;
      const courseName = 'Tested Course';
      const course: Course = new Course(courseId, courseName);

      return request(app.getHttpServer())
        .patch(`/course/${courseId}`)
        .expect('Content-Type', /json/)
        .send(course)
        .expect(200)
        .expect(JSON.stringify(course));
    });

    test('/course (DELETE)', () => {
      const courseId = 1014760;

      return request(app.getHttpServer())
        .delete(`/course/${courseId}`)
        .set('Accept', 'application/json')
        .expect(200);
    });
  });

  describe('-- /course POST errors -- ', () => {
    test('should raise a conflict error when post a duplicate', () => {
      const courseId = 1014760;
      const courseName = 'BTEC L3 90 IT';
      const course: Course = new Course(courseId, courseName);

      return request(app.getHttpServer())
        .post('/course')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send(course)
        .expect(409);
    });

    test('should raise a bad request error when post an empty request body', () => {
      return request(app.getHttpServer())
        .post('/course')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({})
        .expect(400);
    });

    test('should raise a bad request error when post a missing required field', () => {
      return request(app.getHttpServer())
        .post('/course')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({ CourseID: 9 })
        .expect(400);
    });

    test('should throw a bad request error when CourseID request property is not numeric', () => {
      return request(app.getHttpServer())
        .post('/course')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
          CourseID: 'a',
          CourseName: 'Test Course',
        })
        .expect(400);
    });
  });

  describe('-- /course PATCH errors -- ', () => {
    test('should raise a bad request error when post an empty request body', () => {
      const courseID = 1014760;

      return request(app.getHttpServer())
        .patch(`/course/${courseID}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({})
        .expect(400);
    });

    test('should raise a bad request error when post a missing required field', () => {
      const courseID = 1014760;

      return request(app.getHttpServer())
        .patch(`/course/${courseID}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
          CourseName: 'Example course name',
        })
        .expect(400);
    });

    test('should throw a bad request error when CourseID request property is not numeric', () => {
      const courseID = 1014760;

      return request(app.getHttpServer())
        .patch(`/course/${courseID}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
          CourseID: 'invalid course ID',
          CourseName: 'Example course name',
        })
        .expect(400);
    });
  }),
    describe('-- /course DELETE errors -- ', () => {
      test('should throw a not found error when delete a course with ID that does not exist', () => {
        return request(app.getHttpServer())
          .delete('/course/108765')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(404);
      });
    });

  describe('-- /course GET errors -- ', () => {
    test('should throw a not found error when get a course with ID that does not exist', () => {
      return request(app.getHttpServer())
        .get('/course/108765')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404);
    });
  });
});

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import * as request from 'supertest';

import { AppModule } from './../../src/app.module';
import { ApplicationOptions } from './../../src/app.interfaces';

const { error: testLogger } = console; // keep ts-lint happy

process.stdout.write = jest.fn(); // mock process.stdout.write, prevent a flood of debug messages

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let testModule: TestingModule;
  const silentLogging = true;
  const appOptions: ApplicationOptions = {
    seedData: true,
    loggingOptions: { level: 'debug', silent: silentLogging },
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

  test('/ (GET)', done => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!')
      .end(done);
  });
});

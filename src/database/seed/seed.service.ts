import { Injectable, OnModuleInit, ShutdownSignal } from '@nestjs/common';
import { QueryRunner, Connection, InsertResult } from 'typeorm';

import { Course } from '../../course/course.entity';
import { LoggingService } from '../../logger/logger.service';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    private readonly connection: Connection,
    private readonly logger: LoggingService,
  ) {}

  public async onModuleInit(): Promise<void> {
    let queryRunner: QueryRunner;

    this.logger.info('SeedService::onModuleInit::seeding data...');

    try {
      queryRunner = this.connection.createQueryRunner('master');
      await queryRunner.connect();
      await this.seed(queryRunner);
      this.logger.info('SeedService:onModuleInit::seeding data complete...');
    } catch (err) {
      // log errors from seeding here
      if (err instanceof Error) {
        this.logger.error(
          `SeedService::onModuleInit::error => ${err.message}`,
          err.stack,
        );
        // trigger a graceful shutdown
        process.kill(process.pid, ShutdownSignal.SIGTERM);
      } else {
        this.logger.error(
          `SeedService::onModuleInit::error => ${err}`,
          'stack trace unavailable',
        );
      }
    } finally {
      if (queryRunner && !queryRunner.isReleased) {
        queryRunner.release();
      }
    }
  }

  public async seed(queryRunner: QueryRunner): Promise<void> {
    try {
      // catch an exception to rollback the transaction, then rethrow
      await queryRunner.startTransaction();
      await this.seedCourses(queryRunner);
      return await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    }
  }

  private async seedCourses(queryRunner: QueryRunner): Promise<InsertResult> {
    return await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Course)
      .values([
        {
          CourseID: 1014760,
          CourseName: 'BTEC L3 90 IT',
        },
        {
          CourseID: 1015101,
          CourseName: 'BTEC L2 IT',
        },
      ])
      .execute();
  }
}

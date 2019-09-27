import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1568198782367 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE "coursemanagement"."course" \
      ("CourseID" integer NOT NULL, \
      "CourseName" character varying(50) NOT NULL, \
      CONSTRAINT "PK_03e55174a318fba9b49c6361c09" \
      PRIMARY KEY ("CourseID"))',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DROP TABLE "coursemanagement"."course"');
  }
}

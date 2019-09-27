import { Logger } from '@nestjs/common';
import { createConnection, Connection, QueryRunner, Table } from 'typeorm';

import { ConfigOptions } from './config/models/config.options';
import { ConfigServiceFactory } from './config/factories/configservice.factory';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Migration } from 'typeorm/migration/Migration';

async function dispose(connection: Connection): Promise<void> {
  if (connection && connection.isConnected) {
    await connection.close();
  }
}

async function createAConnection(): Promise<Connection> {
  let connection: Connection;

  // override default connections to avoid dropping schema and running migrations
  // we are doing this manually
  const config: ConfigOptions = ConfigServiceFactory.loadDbConfigSync();
  const dbConfig: PostgresConnectionOptions = config.db as PostgresConnectionOptions;
  const connect: PostgresConnectionOptions = {
    ...dbConfig,
    dropSchema: false,
    logging: false,
    migrationsRun: false,
  };

  try {
    Logger.log(
      `createAConnection() => Connecting with options => ${JSON.stringify(
        connect,
        null,
        2,
      )}`,
    );
    connection = await createConnection(connect);
    Logger.log('createAConnection() => Dropping database...');
    await connection.dropDatabase();
    Logger.log('createAConnection() => Database successfully dropped');
  } catch (err) {
    Logger.error(`createAConnection() => Failed to connect => ${err}`);
    await dispose(connection);
    throw err;
  }
  Logger.log('createAConnection() => connected');

  return connection;
}

async function driver(connection: Connection): Promise<void> {
  Logger.log(
    `Running migrations with connection status ${connection.isConnected}`,
  );
  const migrations: Migration[] = await connection.runMigrations();
  Logger.log('Migrations successfully ran, these are...');
  migrations.forEach(element => {
    Logger.log(`Migration => ${element.name}`);
  });

  Logger.log('Creating QueryRunner');
  const queryRunner: QueryRunner = connection.createQueryRunner('master');
  await queryRunner.connect();
  Logger.log('QueryRunner connected');

  // Logger.log('Release QueryRunner....');
  // queryRunner.release();

  // Logger.log('Creating a new connection to QueryRunner...');
  // queryRunner = connection.createQueryRunner('master');
  // await queryRunner.connect();
  // Logger.log('Reconnected QueryRunner...');

  const databases: string[] = await queryRunner.getDatabases();
  Logger.log(
    `Retrieved databases using queryRunner.getDatabases() :: ${JSON.stringify(
      databases,
    )}`,
  );
  const schemas: string[] = await queryRunner.getSchemas();
  Logger.log(
    `Retrieved schemas using queryRunner.getSchemas() :: ${JSON.stringify(
      schemas,
    )}`,
  );
  const tables: Table[] = await queryRunner.getTables([
    'coursemanagement.Course',
    'coursemanagement.Migrations',
  ]);
  Logger.log(
    `Retrieved expected tables using queryRunner.getTables => ${JSON.stringify(
      tables,
    )}`,
  );
}

async function main(): Promise<void> {
  const myConnection: Connection = await createAConnection();
  await driver(myConnection);
}

const m: string = 'm';
main();

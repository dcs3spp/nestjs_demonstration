## Description

[Nest](https://github.com/nestjs/nest) repository that demonstrates the following features:

- Use of [nestjs/typeorm](https://github.com/nestjs/typeorm) with a PostgreSQL backend.
- Use of [typeorm](https://github.com/typeorm/typeorm) migrations to create initial database structure
  on an empty precreated database.
- Use of [nestjsx/crud](https://github.com/nestjsx/crud) for generating
  Rest API endpoints, swagger documentation and request body validation.
- [Jest](https://jestjs.io) unit tests with examples of mocking.
- [Jest](https://jestjs.io) e2e tests with [supertest](https://github.com/visionmedia/supertest#readme).

## Installation

```bash
$ npm install
```

## Build

```bash
$ npm run build
```

## Database Installation

A PostgreSQL database is used for the backend. This is configured by setting the following environment variables:

| Variables   |                Description |
| ----------- | -------------------------: |
| DB_HOST     |          Database hostname |
| DB_NAME     |       Name of the database |
| DB_PASSWORD |          Database password |
| DB_PORT     |           Port of database |
| DB_SCHEMA   |     Schema of the database |
| DB_USER     | Username of database owner |

- Create a test.env and development.env file that encapsulates these environment variables for test and
  development environments respectively. Both test.env and development.env files should exist in the
  root folder of the source repository. These are not commited into source control, however a sample is
  provided in source control: _config.sample.env_. For production environments set the environment variables on the hosting environment.
- Create a new empty PostgreSQL database with _name_ and _schema_ matching the value of the
  _DB_NAME_ and _DB_SCHEMA_ variables respectively. Ensure that the database and schema is owned by the
  user referred to in the _DB_USER_ environment variable.
- Migrations will automatically create the schema.

### Database Configuration

- A dedicated *Config* module automatically and transparently creates a configuration object dependent upon the build environment. For production environments the config object is derived from environment variables within the inherent shell. For development and test environments the configuration object is derived from the development.env and test.env files respectively. In summary a *ConfigService* class exposes a [TypeOrmModuleOptions](https://github.com/nestjs/typeorm/blob/master/lib/interfaces/typeorm-options.interface.ts) instance, representing a configuration object for connecting to the database and performing migration/seed operations. Please refer to the source code for the config module within the _src/config_ folder for further details. 

### Test database

- The database configured via dotenv file, _test.env_, is dropped each time the Application module is instantiated and migrations are run from _src/database/migrations_. This is performed transparently to the developer and allows each test to use a fresh database environment. Test data is automatically seeded when the _SeedModule_ is imported. Seeding is only performed for development and test build environments and is initialised during the application bootstrap process.
- An alternative mechanism would be to use transactions to rollback after each test has completed. The [typeorm-test-transations](https://github.com/entrostat/typeorm-test-transactions) library uses this approach, although it uses the _@Transactional_ decorator which is marked as deprecated in future releases of [typeorm](https://github.com/typeorm/typeorm/issues/3251#issue-390989433). Another [solution](https://github.com/nestjs/nest/issues/1843#issuecomment-518012896) could be to use typeorm _EntityManager_ / _QuerryRunner_ to manage transactions.

## Running the server for the Rest API

```bash
# watch mode development
$ npm run start:dev

# watch mode for debugger attachment
$ npm run start:debug

# production mode
$ npm run start:prod
```

The Rest API endpoints can be viewed by visiting http://localhost:3000/api once the server has been started.

## Test

[Jest](https://jestjs.io/en/) is used for unit, integration and e2e tests.

```bash
# unit tests
$ npm run test

# unit tests in watch mode
$ npm run test:watch

#unit tests for debugger attachment
$ npm run test:debug

# e2e tests inside ./test folder
# use seed function in ./database/seed/seed.service.ts to load test data
# this module is only loaded for test and development environments
# database dropped and seed data loaded per test
$ npm run test:e2e

# test coverage
# coverage statistics are stored in the ./coverage folder.
$ npm run test:cov
```

### Test Configuration

- Unit and integration test configuration file is found in _./test/unit/jest.config.js_
- E2e test configuration file is found in _./test/e2e/jest-e2e.config.js_

It is possible to specify hooks that are run before each testfile runs and before each individual test is run. The hooks are specified in files _setup.ts_ and _setupAfterEnv.ts_ respectively. These are located within _./test/e2e_ and _./test/unit folders_. Refer to [setupFiles](https://jestjs.io/docs/en/configuration.html#setupfiles-array) and [setupFilesAfterEnv](https://jestjs.io/docs/en/configuration.html#setupfilesafterenv-array) for further information.

## Typeorm

```bash
# use typeorm cli
$ npm run typeorm:cli --version

# add a migration encapsulating schema changes
npm run migration:add -- --config ./myormconfig.ts --connection default -n testmigration

# create an empty migration
$ npm run migration:create -- --config ./myormconfig.ts --connection default -n emptymigration

# run typeorm migrations
npm run migrations:run -- --config ./myormconfig.ts --connection default

# revert latest typeorm migration
npm run migration:revert --config ./myormconfig.ts --connection default
```

## Linting

Linting can be performed on files within the src folder by issuing the following command:
`npm run lint`. Lint rules are defined in _eslintrc_ from within the root folder of the
source repository. To fix lint errors run `npm run lint:fix` from within the source
repository.

## Prettier

[Prettier](https://prettier.io) has been used to provide automated code formatting. Rules are
defined in _.prettierrc_ in the root folder of the source repository. Run the script
`npm run prettier` to apply the rules automatically to format javascript, json and typescript files.
These are applied automatically by default within Visual Studio Code. To disable this behaviour
set the _editor.formatOnSave_ option to false within _./vscode/settings.json_.

## Webpack

Weboack configuration scripts exist in the _webpack_ folder of the project root folder.

Scripts are provided to build webpack development and production environment.

```bash
# perform a webpack build for development environment with hot module replacement
# and watch enabled, issue the script npm run start:webpack:dev to start the server
# after issuing this command
npm run webpack:dev

# perform a webpack build for production environment with TersePlugin performing
# minification
npm run webpack:prod
```

Scripts are provided to start the node server.

```bash
# start server after a webpack build
npm run start:webpack:dev

# start server, performing a webpack build a priori
npm run start:webpack:prod
```

## Visual Studio Code

Configurations for launchers, settings and tasks are provided in the _.vscode_ folder.

The following launch rules are provided for use in Visual Studio Code

- **Attach starter by Process ID**: Attach to an existing running node process.
- **Debug unit tests**: Start unit tests and attach Visual Studio Code debugger.
- **Debug end to end tests**: Start end to end tests and attach Visual Studio Code debugger.
- **Launch start:debug via npm**: Launch the application and attach to debugger.

The _build_ task runs the npm _build_ script inside _package.json_.
This is configured as the default build task.

The _settings.json_ file configures _Visual Studio Code_ to use the typescript compiler in
_nodemodules_ folder. Furthermore, prettier code formatting options _editor.formatOnPaste_ and
_editor.formatOnSave_ are set to true by default.

## Issues

When running the tests there is a memory leak in Winston logger potentially due to issues [#1620](https://github.com/winstonjs/winston/issues/1620),[#1334](https://github.com/winstonjs/winston/issues/1334) and [#1706](https://github.com/winstonjs/winston/issues/1706).

Webpack and eslint-loader uses legacy version of mkdir in minimist package. Package warnings will be received upon install until this has been resolved by the
package maintainers, either by backport fix or through the next semantic version release. At the time of writing an issue has been posted at 
[webpack](https://github.com/webpack/webpack/issues/10561).
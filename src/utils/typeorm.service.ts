import { ClassType } from 'class-transformer/ClassTransformer';
import { ConflictException } from '@nestjs/common';
import { CrudRequest } from '@nestjsx/crud';
import { hasLength, isObject, objKeys } from '@nestjsx/util';
import { plainToClass } from 'class-transformer';
import { QueryFilter } from '@nestjsx/crud-request';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

export class MyTypeOrmCrudService<T> extends TypeOrmCrudService<T> {
  constructor(protected repo: Repository<T>) {
    super(repo);
  }

  /**
   * Create one
   * The createOne method is overriden to provide the following semantics.
   * If the entity exists a ConflictException is thrown.
   * If the entity does not exist then it is saved in the repository.
   *
   * Requires typescript 3.1.6 due to a bug/issue with typescript compiler
   * and the typeorm library when using `this.repo.findOne(entity)`
   * Refer to:
   * - https://github.com/microsoft/TypeScript/issues/21592
   * - https://github.com/typeorm/typeorm/pull/4470
   *
   * If using VSCode, use local typescript compiler in settings.json file
   * `{
   * "typescript.tsdk": "node_modules/typescript/lib"
   * }`
   *
   * Alternatively, modify typeorm-find-options/FindConditions.d.ts as detailed in code snippet
   * below to address excessive stack depth error when using this.repo.findOne(entity)
   * see typeorm issue #4470 @ https://github.com/typeorm/typeorm/pull/4470 (awaiting merge)
   * `export declare type FindConditions<T> = {
   *     [P in keyof T]?: T[P] extends never ? FindConditions<T[P]> |
   *      FindOperator<FindConditions<T[P]>> : FindConditions<T[P]> |
   *      FindOperator<FindConditions<T[P]>>;
   * };`
   * @param req
   * @param dto
   */
  public async createOne(req: CrudRequest, dto: T): Promise<T> {
    const entity: T = this.createEntity(dto, req.parsed.paramsFilter);

    /* istanbul ignore if */
    if (!entity) {
      this.throwBadRequestException('Empty data. Nothing to save.');
    }

    // we have to pass entity as any here to avoid typeorm issue #4470 with
    // typescript compiler 3.1.6
    // const result = await this.repo.findOne(<any>entity);
    const result = await this.repo.findOne(entity);
    if (result) {
      this.throwConflictException('Attempt to save duplicate entity');
    }
    // this was this.repo.save<any>(entity) fixed through upgrading to typescript 3.6.3 which
    // includes fix for typeorm issue #4470
    return this.repo.save(entity);
  }

  private get entityClassType(): ClassType<T> {
    return this.repo.target as ClassType<T>;
  }

  protected createEntity(dto: T, paramsFilter: QueryFilter[]): T {
    /* istanbul ignore if */
    if (!isObject(dto)) {
      return undefined;
    }

    if (hasLength(paramsFilter)) {
      for (const filter of paramsFilter) {
        dto[filter.field] = filter.value;
      }
    }

    /* istanbul ignore if */
    if (!hasLength(objKeys(dto))) {
      return undefined;
    }

    return dto instanceof this.entityClassType
      ? dto
      : plainToClass(this.entityClassType, dto);
  }

  protected throwConflictException(name: string): ConflictException {
    throw new ConflictException(`${name} not found`);
  }
}

import { inject, injectable } from 'inversify';
import { Raw } from 'typeorm';
import { Instant } from 'src/model/entity/Instant';
import { InstantEntity } from 'src/model/entity/InstantEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for Instant model.
 */
@injectable()
export class InstantAccess {
  @inject(Database)
  private readonly database!: Database;

  public async find() {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<Instant>(InstantEntity.name, {
      where: { closedAt: Raw((alias) => `${alias} > NOW()`) },
    });
  }

  public async save(input: Instant) {
    const qr = await this.database.getQueryRunner();
    const entity = new InstantEntity();
    Object.assign(entity, input);

    return await qr.manager.save(entity);
  }
}

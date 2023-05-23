import { inject, injectable } from 'inversify';
import { Database } from 'src/util/Database';

/**
 * Access class for common Db functions.
 */
@injectable()
export class DbAccess {
  @inject(Database)
  private readonly database!: Database;

  public async cleanup() {
    await this.database.cleanUp();
  }

  public async startTransaction() {
    const qr = await this.database.getQueryRunner();
    await qr.startTransaction();
  }

  public async commitTransaction() {
    const qr = await this.database.getQueryRunner();
    await qr.commitTransaction();
  }

  public async rollbackTransaction() {
    const qr = await this.database.getQueryRunner();
    await qr.rollbackTransaction();
  }

  public async resetSqlStats() {
    const qr = await this.database.getQueryRunner();
    await qr.manager.query('select crdb_internal.reset_sql_stats()');
  }
}

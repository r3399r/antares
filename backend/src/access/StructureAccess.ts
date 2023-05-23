import { inject, injectable } from 'inversify';
import { Structure } from 'src/model/entity/Structure';
import { StructureEntity } from 'src/model/entity/StructureEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for Structure model.
 */
@injectable()
export class StructureAccess {
  @inject(Database)
  private readonly database!: Database;

  public async findByInstantId(instantId: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<Structure>(StructureEntity.name, {
      where: { instantId },
    });
  }

  public async save(input: Structure) {
    const qr = await this.database.getQueryRunner();
    const entity = new StructureEntity();
    Object.assign(entity, input);

    return await qr.manager.save(entity);
  }
}

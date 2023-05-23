import { inject, injectable } from 'inversify';
import { DbAccess } from 'src/access/DbAccess';
import { InstantAccess } from 'src/access/InstantAccess';
import { StructureAccess } from 'src/access/StructureAccess';
import { GetInstantResponse, PostInstantRequest } from 'src/model/api/Instant';
import { InstantEntity } from 'src/model/entity/InstantEntity';
import { StructureEntity } from 'src/model/entity/StructureEntity';

/**
 * Service class for Instant
 */
@injectable()
export class InstantService {
  @inject(DbAccess)
  private readonly dbAccess!: DbAccess;

  @inject(InstantAccess)
  private readonly instantAccess!: InstantAccess;

  @inject(StructureAccess)
  private readonly structureAccess!: StructureAccess;

  public async cleanup() {
    await this.dbAccess.cleanup();
  }

  public async addInstant(data: PostInstantRequest) {
    try {
      await this.dbAccess.startTransaction();

      const instant = new InstantEntity();
      instant.serial = data.serial;
      instant.topic = data.topic;
      instant.cost = data.cost;
      instant.total = data.total;
      instant.releasedAt = data.releasedAt;
      instant.closedAt = data.closedAt;

      const newInstant = await this.instantAccess.save(instant);

      for (const p of data.structure) {
        const structure = new StructureEntity();
        structure.instantId = newInstant.id;
        structure.prize = p.prize;
        structure.count = p.count;

        await this.structureAccess.save(structure);
      }

      await this.dbAccess.commitTransaction();
    } catch (e) {
      await this.dbAccess.rollbackTransaction();
      throw e;
    }
  }

  public async getInstants(): Promise<GetInstantResponse> {
    const instants = await this.instantAccess.find();

    return await Promise.all(
      instants.map(async (v) => {
        const structure = await this.structureAccess.findByInstantId(v.id);

        return {
          id: v.id,
          serial: v.serial,
          topic: v.topic,
          cost: v.cost,
          total: v.total,
          releasedAt: v.releasedAt,
          closedAt: v.closedAt,
          structure: structure.map((o) => ({
            id: o.id,
            prize: o.prize,
            count: o.count,
          })),
        };
      })
    );
  }
}

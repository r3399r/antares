import { BeforeInsert, BeforeUpdate, Column, Entity, Generated } from 'typeorm';
import { Structure } from './Structure';

@Entity({ name: 'structure' })
export class StructureEntity implements Structure {
  @Column({ primary: true })
  @Generated('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'instant_id' })
  instantId!: string;

  @Column({ type: 'int8' })
  prize!: number;

  @Column({ type: 'int8' })
  count!: number;

  @Column({ type: 'timestamp', name: 'created_at', default: null })
  createdAt: string | null = null;

  @Column({ type: 'timestamp', name: 'updated_at', default: null })
  updatedAt: string | null = null;

  @BeforeInsert()
  setDateCreated(): void {
    this.createdAt = new Date().toISOString();
  }

  @BeforeUpdate()
  setDateUpdated(): void {
    this.updatedAt = new Date().toISOString();
  }
}

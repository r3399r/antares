import { BeforeInsert, BeforeUpdate, Column, Entity, Generated } from 'typeorm';
import { Instant } from './Instant';

@Entity({ name: 'instant' })
export class InstantEntity implements Instant {
  @Column({ primary: true })
  @Generated('uuid')
  id!: string;

  @Column({ type: 'text' })
  serial!: string;

  @Column({ type: 'text' })
  topic!: string;

  @Column({ type: 'int8' })
  cost!: number;

  @Column({ type: 'int8' })
  total!: number;

  @Column({ type: 'timestamp', name: 'released_at' })
  releasedAt!: string;

  @Column({ type: 'timestamp', name: 'closed_at' })
  closedAt!: string;

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

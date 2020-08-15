import {
  Entity,
  PrimaryColumn,
  Column,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { nanoid } from 'nanoid';
import { User } from '../user.entity';

@Entity({ name: 'tokens' })
export class Token {
  @PrimaryColumn()
  id: string;

  @ManyToOne(
    type => User,
    user => user.tokens,
  )
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  token: string;

  @Column()
  type: string;

  @Column({ name: 'created_at', default: 'now()' })
  createdAt: Date;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @BeforeInsert()
  setDefaults() {
    if (!this.id) {
      this.id = nanoid();
    }
  }
}

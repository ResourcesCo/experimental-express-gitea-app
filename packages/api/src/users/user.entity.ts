import {
  Entity,
  PrimaryColumn,
  Column,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { nanoid } from 'nanoid';
import { Token } from './tokens/token.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_digest' })
  passwordDigest: string;

  // This is the user auth ID, used with a JWT. It must
  // not be used as the sole form of authentication.
  // This is used instead of JWT-ing the user id so
  // a user's access can be revoked (i. e. in case an
  // account is compromised) without changing the id.
  @Column({ name: 'user_auth_id' })
  userAuthId: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ name: 'is_active', default: 'false' })
  isActive: boolean;

  @OneToMany(
    type => Token,
    token => token.user,
  )
  tokens: Token[];

  @BeforeInsert()
  setDefaults() {
    if (!this.id) {
      this.id = nanoid();
    }
    if (!this.userAuthId) {
      this.userAuthId = nanoid();
    }
  }
}

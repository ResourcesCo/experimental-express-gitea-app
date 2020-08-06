import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  email: string;

  @Column({ name: 'password_digest' })
  passwordDigest: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;
}

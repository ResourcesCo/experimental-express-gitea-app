CREATE TABLE users (
  id uuid primary key,
  email text not null,
  active boolean not null,
  created_at timestamp not null,
  updated_at timestamp not null
)

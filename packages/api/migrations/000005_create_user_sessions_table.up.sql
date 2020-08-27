create table user_sessions (
  id uuid primary key not null,
  user_id uuid not null,
  active boolean not null,
  expires_at timestamp not null,
  created_at timestamp not null,
  updated_at timestamp not null
);
create index user_sessions_by_user_id on user_sessions (user_id);

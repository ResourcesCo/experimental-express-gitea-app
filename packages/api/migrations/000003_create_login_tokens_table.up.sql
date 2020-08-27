create table login_tokens (
  id uuid primary key not null,
  user_id uuid not null,
  token text not null,
  active boolean not null,
  expires_at timestamp not null,
  created_at timestamp not null,
  updated_at timestamp not null
);
create index login_tokens_by_user_id on login_tokens (user_id);
create unique index login_tokens_by_token on login_tokens (token);

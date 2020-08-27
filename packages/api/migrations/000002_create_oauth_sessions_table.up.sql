create table oauth_sessions (
  id uuid primary key,
  user_id uuid not null,
  provider text not null,
  provider_user_id text not null,
  access_token text not null,
  refresh_token text,
  created_at timestamp not null,
  updated_at timestamp not null 
);
create unique index oauth_sessions_by_provider on oauth_sessions (provider, provider_user_id);

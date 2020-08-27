create table invite_codes (
  id uuid primary key,
  active boolean not null,
  recipient_user_id uuid,
  sender_user_id uuid,
  token text not null,
  created_at timestamp not null,
  updated_at timestamp not null
)

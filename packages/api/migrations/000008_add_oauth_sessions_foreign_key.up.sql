ALTER TABLE oauth_sessions
ADD CONSTRAINT oauth_sessions_user_fk
FOREIGN KEY (user_id) REFERENCES users (id)
MATCH FULL ON DELETE CASCADE;
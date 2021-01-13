ALTER TABLE users ADD COLUMN username text NULL default NULL;
UPDATE users SET username = email;
ALTER TABLE users ALTER COLUMN username DROP DEFAULT;
ALTER TABLE users ADD CONSTRAINT users_username_unique UNIQUE (username);
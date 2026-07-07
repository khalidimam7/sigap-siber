create table if not exists staff_users (
  id text primary key,
  name text not null,
  email text not null,
  username text not null,
  role text not null default 'PETUGAS_ADMIN',
  is_active boolean not null default true,
  password_hash text not null,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_staff_users_email_lower on staff_users (lower(email));
create unique index if not exists idx_staff_users_username_lower on staff_users (lower(username));
create index if not exists idx_staff_users_active on staff_users(is_active);

create table if not exists auth_sessions (
  id text primary key,
  user_id text not null references staff_users(id) on delete cascade,
  token_hash text not null unique,
  user_agent text,
  ip_address text,
  expires_at timestamptz not null,
  absolute_expires_at timestamptz not null,
  last_seen_at timestamptz not null default now(),
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_auth_sessions_user_id on auth_sessions(user_id);
create index if not exists idx_auth_sessions_token_hash on auth_sessions(token_hash);
create index if not exists idx_auth_sessions_expires_at on auth_sessions(expires_at);

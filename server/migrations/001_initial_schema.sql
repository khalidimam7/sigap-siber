create table if not exists tickets (
  id text primary key,
  title text not null,
  reporter text not null,
  reporter_type text not null check (reporter_type in ('Publik', 'OPD')),
  agency text,
  contact text not null,
  email text,
  category text not null,
  priority text not null default 'Sedang',
  status text not null default 'Baru',
  occurred_at text,
  asset text not null,
  chronology text not null,
  impact text not null,
  assignee text not null default 'Belum ditugaskan',
  public_note text not null default 'Laporan telah diterima dan menunggu pemeriksaan petugas.',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ticket_attachments (
  id bigserial primary key,
  ticket_id text not null references tickets(id) on delete cascade,
  file_name text not null,
  created_at timestamptz not null default now(),
  unique (ticket_id, file_name)
);

create table if not exists notifications (
  id bigserial primary key,
  ticket_id text not null references tickets(id) on delete cascade,
  channel text not null default 'telegram',
  status text not null,
  message_id text,
  chat_id text,
  provider_status integer,
  description text,
  reason text,
  attempted_at timestamptz not null default now(),
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id bigserial primary key,
  actor text not null default 'system',
  action text not null,
  target_type text not null,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_tickets_created_at on tickets(created_at desc);
create index if not exists idx_tickets_status on tickets(status);
create index if not exists idx_tickets_category on tickets(category);
create index if not exists idx_ticket_attachments_ticket_id on ticket_attachments(ticket_id);
create index if not exists idx_notifications_ticket_id_created_at on notifications(ticket_id, created_at desc);
create index if not exists idx_audit_logs_target on audit_logs(target_type, target_id);

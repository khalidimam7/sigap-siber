alter table ticket_attachments
  add column if not exists stored_name text,
  add column if not exists content_type text,
  add column if not exists size_bytes bigint;

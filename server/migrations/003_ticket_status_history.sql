create table if not exists ticket_status_history (
  id bigserial primary key,
  ticket_id text not null references tickets(id) on delete cascade,
  status text not null,
  changed_by text not null default 'system',
  changed_at timestamptz not null default now()
);

create index if not exists idx_ticket_status_history_ticket_id_changed_at on ticket_status_history(ticket_id, changed_at asc);

insert into ticket_status_history (ticket_id, status, changed_by, changed_at)
select id, 'Baru', 'system', created_at
from tickets
where not exists (
  select 1
  from ticket_status_history h
  where h.ticket_id = tickets.id
    and h.status = 'Baru'
);

insert into ticket_status_history (ticket_id, status, changed_by, changed_at)
select id, status, 'system', updated_at
from tickets
where status <> 'Baru'
  and not exists (
    select 1
    from ticket_status_history h
    where h.ticket_id = tickets.id
      and h.status = tickets.status
  );

-- Alpha Nation Call Center data model foundation.
-- Keep telephony secrets out of this schema and out of frontend code.

create table if not exists cc_campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text unique not null,
  dialing_mode text not null default 'progressive',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists cc_dids (
  id uuid primary key default gen_random_uuid(),
  phone_number text unique not null,
  label text,
  provider text,
  campaign_id uuid references cc_campaigns(id) on delete set null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists cc_agents (
  id uuid primary key default gen_random_uuid(),
  crm_user_id uuid,
  display_name text not null,
  role text not null default 'agent',
  status text not null default 'offline',
  pause_code text,
  last_status_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists cc_call_sessions (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references cc_campaigns(id) on delete set null,
  agent_id uuid references cc_agents(id) on delete set null,
  did_id uuid references cc_dids(id) on delete set null,
  crm_lead_id uuid,
  direction text not null,
  state text not null default 'initiated',
  started_at timestamptz,
  answered_at timestamptz,
  ended_at timestamptz,
  duration_seconds integer,
  disposition text,
  created_at timestamptz not null default now()
);

create table if not exists cc_call_events (
  id bigserial primary key,
  call_id uuid not null references cc_call_sessions(id) on delete cascade,
  event_type text not null,
  event_at timestamptz not null default now(),
  payload jsonb not null default '{}'::jsonb
);

create table if not exists cc_recordings (
  id uuid primary key default gen_random_uuid(),
  call_id uuid not null references cc_call_sessions(id) on delete cascade,
  storage_key text not null,
  duration_seconds integer,
  created_at timestamptz not null default now()
);

create table if not exists cc_monitoring_sessions (
  id uuid primary key default gen_random_uuid(),
  supervisor_user_id uuid not null,
  agent_id uuid not null references cc_agents(id) on delete cascade,
  call_id uuid references cc_call_sessions(id) on delete set null,
  mode text not null check (mode in ('listen','whisper','barge')),
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

create index if not exists cc_call_sessions_agent_idx on cc_call_sessions(agent_id, created_at desc);
create index if not exists cc_call_sessions_campaign_idx on cc_call_sessions(campaign_id, created_at desc);
create index if not exists cc_call_events_call_idx on cc_call_events(call_id, event_at);

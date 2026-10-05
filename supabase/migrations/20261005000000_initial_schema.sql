-- =============================================================================
-- The Experts — initial schema
--
-- Leads pipeline:  customers ─┬─< quote_requests ─┬─< quote_request_files
--                             │                   ├─< consultation_bookings
--                             │                   ├─< lead_notes
--                             │                   └─< lead_status_history
--                             └─< projects (a won quote request becomes a project)
--                 integration_links: external IDs for CRM / other systems
--
-- Uploaded files live in Supabase Storage (private bucket `quote-uploads`);
-- the database only stores their metadata and storage path.
--
-- Security: RLS is enabled on every table with no public policies, so the
-- anon/authenticated roles cannot read or write anything. The website writes
-- through server-side code using the service-role key. Add policies here when
-- an admin dashboard with logins is built.
-- =============================================================================

create extension if not exists citext with schema extensions;

-- ---------------------------------------------------------------------------
-- Enums (statuses). Add values later with: alter type ... add value '...';
-- ---------------------------------------------------------------------------
create type public.lead_status as enum (
  'new', 'contacted', 'consultation_booked', 'estimate_sent', 'won', 'lost', 'archived'
);
create type public.booking_status as enum (
  'scheduled', 'rescheduled', 'cancelled', 'completed', 'no_show'
);
create type public.project_status as enum (
  'planning', 'in_progress', 'on_hold', 'completed', 'cancelled'
);
create type public.file_category as enum (
  'existing_photos', 'floor_plans', 'inspiration', 'measurements'
);

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- ---------------------------------------------------------------------------
-- customers — one row per person, de-duplicated by email
-- ---------------------------------------------------------------------------
create table public.customers (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null check (char_length(full_name) between 1 and 120),
  email       extensions.citext not null unique,
  phone       text not null check (char_length(phone) between 7 and 30),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger customers_updated_at before update on public.customers
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- quote_requests — one row per submitted estimate questionnaire (a "lead")
-- Option columns use text + check constraints (easy to extend in a migration).
-- ---------------------------------------------------------------------------
create sequence public.quote_request_number_seq;

create table public.quote_requests (
  id               uuid primary key default gen_random_uuid(),
  reference        text not null unique
                   default 'EXP-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.quote_request_number_seq')::text, 5, '0'),
  customer_id      uuid not null references public.customers (id) on delete restrict,
  status           public.lead_status not null default 'new',

  renovation_type  text not null check (renovation_type in (
                     'kitchen', 'bathroom', 'full_home', 'exterior', 'repairs',
                     'commercial', 'new_construction', 'other')),
  work_types       text[] not null default '{}',
  work_type_other  text check (char_length(work_type_other) <= 300),
  budget_range     text not null check (budget_range in (
                     'under_5k', '5k_10k', '10k_25k', '25k_50k', '50k_100k', '100k_plus', 'not_sure')),
  area             text not null check (area in ('male', 'hulhumale', 'other')),
  address          text not null check (char_length(address) between 3 and 300),
  postcode         text check (postcode ~ '^\d{5}$'),
  start_timeline   text not null check (start_timeline in (
                     'asap', '1_3_months', '3_6_months', '6_plus_months', 'researching')),
  description      text not null check (char_length(description) between 20 and 4000),

  source           text not null default 'website',
  utm              jsonb not null default '{}'::jsonb,
  assigned_to      text,                       -- staff member (until staff accounts exist)
  estimated_value_mvr numeric(12, 2),          -- filled in when an estimate is prepared

  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index quote_requests_status_created_idx on public.quote_requests (status, created_at desc);
create index quote_requests_customer_idx on public.quote_requests (customer_id);
create trigger quote_requests_updated_at before update on public.quote_requests
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- quote_request_files — metadata for files in Storage bucket `quote-uploads`
-- ---------------------------------------------------------------------------
create table public.quote_request_files (
  id                uuid primary key default gen_random_uuid(),
  quote_request_id  uuid not null references public.quote_requests (id) on delete cascade,
  category          public.file_category not null,
  bucket            text not null default 'quote-uploads',
  storage_path      text not null unique,
  original_name     text not null,
  content_type      text not null,
  size_bytes        integer not null check (size_bytes > 0),
  created_at        timestamptz not null default now()
);
create index quote_request_files_request_idx on public.quote_request_files (quote_request_id);

-- ---------------------------------------------------------------------------
-- consultation_bookings — synced from Cal.com webhooks (or other providers)
-- ---------------------------------------------------------------------------
create table public.consultation_bookings (
  id                uuid primary key default gen_random_uuid(),
  quote_request_id  uuid references public.quote_requests (id) on delete set null,
  customer_id       uuid references public.customers (id) on delete set null,
  provider          text not null default 'calcom',
  external_id       text not null,
  status            public.booking_status not null default 'scheduled',
  starts_at         timestamptz not null,
  ends_at           timestamptz,
  timezone          text,
  location          text,
  attendee_name     text,
  attendee_email    extensions.citext,
  raw_payload       jsonb not null default '{}'::jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (provider, external_id)
);
create index consultation_bookings_request_idx on public.consultation_bookings (quote_request_id);
create index consultation_bookings_starts_idx on public.consultation_bookings (starts_at);
create trigger consultation_bookings_updated_at before update on public.consultation_bookings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- lead_notes — internal notes on a lead (admin dashboard)
-- ---------------------------------------------------------------------------
create table public.lead_notes (
  id                uuid primary key default gen_random_uuid(),
  quote_request_id  uuid not null references public.quote_requests (id) on delete cascade,
  author            text not null,
  body              text not null check (char_length(body) between 1 and 5000),
  created_at        timestamptz not null default now()
);
create index lead_notes_request_idx on public.lead_notes (quote_request_id, created_at desc);

-- ---------------------------------------------------------------------------
-- lead_status_history — audit trail, written automatically by trigger.
-- Set the actor for a change with: select set_config('app.actor', 'Name', true);
-- ---------------------------------------------------------------------------
create table public.lead_status_history (
  id                bigint generated always as identity primary key,
  quote_request_id  uuid not null references public.quote_requests (id) on delete cascade,
  from_status       public.lead_status,
  to_status         public.lead_status not null,
  changed_by        text,
  changed_at        timestamptz not null default now()
);
create index lead_status_history_request_idx on public.lead_status_history (quote_request_id, changed_at);

create or replace function public.log_lead_status()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' or new.status is distinct from old.status then
    insert into public.lead_status_history (quote_request_id, from_status, to_status, changed_by)
    values (
      new.id,
      case when tg_op = 'UPDATE' then old.status end,
      new.status,
      coalesce(nullif(current_setting('app.actor', true), ''), 'system')
    );
  end if;
  return new;
end $$;
create trigger quote_requests_status_history
  after insert or update of status on public.quote_requests
  for each row execute function public.log_lead_status();

-- ---------------------------------------------------------------------------
-- projects — a won lead becomes a project
-- ---------------------------------------------------------------------------
create table public.projects (
  id                  uuid primary key default gen_random_uuid(),
  customer_id         uuid not null references public.customers (id) on delete restrict,
  quote_request_id    uuid unique references public.quote_requests (id) on delete set null,
  title               text not null,
  status              public.project_status not null default 'planning',
  area                text check (area in ('male', 'hulhumale', 'other')),
  address             text,
  contract_value_mvr  numeric(12, 2),
  start_date          date,
  end_date            date,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index projects_customer_idx on public.projects (customer_id);
create trigger projects_updated_at before update on public.projects
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- integration_links — maps our records to external systems (CRM, accounting…)
-- ---------------------------------------------------------------------------
create table public.integration_links (
  id              uuid primary key default gen_random_uuid(),
  provider        text not null,                       -- e.g. 'hubspot', 'zoho'
  entity_type     text not null check (entity_type in ('customer', 'quote_request', 'project', 'consultation_booking')),
  entity_id       uuid not null,
  external_id     text not null,
  last_synced_at  timestamptz,
  sync_error      text,
  metadata        jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (provider, entity_type, entity_id),
  unique (provider, entity_type, external_id)
);
create trigger integration_links_updated_at before update on public.integration_links
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security: on everywhere, no public policies (server-only access).
-- ---------------------------------------------------------------------------
alter table public.customers             enable row level security;
alter table public.quote_requests        enable row level security;
alter table public.quote_request_files   enable row level security;
alter table public.consultation_bookings enable row level security;
alter table public.lead_notes            enable row level security;
alter table public.lead_status_history   enable row level security;
alter table public.projects              enable row level security;
alter table public.integration_links     enable row level security;

-- ---------------------------------------------------------------------------
-- submit_quote_request(payload) — creates/updates the customer, the request
-- and its file rows in ONE transaction. Called by /api/estimates (service role).
-- ---------------------------------------------------------------------------
create or replace function public.submit_quote_request(payload jsonb)
returns table (request_id uuid, request_reference text)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_customer_id uuid;
  v_request_id  uuid;
  v_reference   text;
  f             jsonb;
begin
  insert into public.customers (full_name, email, phone)
  values (payload->>'fullName', payload->>'email', payload->>'phone')
  on conflict (email) do update
    set full_name = excluded.full_name,
        phone     = excluded.phone
  returning id into v_customer_id;

  insert into public.quote_requests (
    customer_id, renovation_type, work_types, work_type_other, budget_range,
    area, address, postcode, start_timeline, description, source, utm
  ) values (
    v_customer_id,
    payload->>'renovationType',
    coalesce(array(select jsonb_array_elements_text(payload->'workTypes')), '{}'),
    nullif(payload->>'workTypeOther', ''),
    payload->>'budget',
    payload->>'area',
    payload->>'address',
    nullif(payload->>'postcode', ''),
    payload->>'timeline',
    payload->>'description',
    coalesce(payload->>'source', 'website'),
    coalesce(payload->'utm', '{}'::jsonb)
  )
  returning id, reference into v_request_id, v_reference;

  for f in select * from jsonb_array_elements(coalesce(payload->'files', '[]'::jsonb)) loop
    insert into public.quote_request_files (
      quote_request_id, category, storage_path, original_name, content_type, size_bytes
    ) values (
      v_request_id,
      (f->>'category')::public.file_category,
      f->>'path',
      f->>'name',
      f->>'contentType',
      (f->>'size')::integer
    );
  end loop;

  return query select v_request_id, v_reference;
end $$;

revoke all on function public.submit_quote_request(jsonb) from public, anon, authenticated;
grant execute on function public.submit_quote_request(jsonb) to service_role;

-- ---------------------------------------------------------------------------
-- Storage: private bucket for questionnaire uploads (images + PDFs, 15 MB max).
-- Uploads use short-lived signed upload URLs issued by the server, so no
-- storage policies for anon users are needed.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'quote-uploads', 'quote-uploads', false, 15728640,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf']
)
on conflict (id) do nothing;

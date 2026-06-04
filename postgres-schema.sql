-- Krypnova PostgreSQL Schema

create extension if not exists pgcrypto;

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),

  first_name varchar(120) not null,
  last_name varchar(120),

  email varchar(255) not null unique,
  phone varchar(40),

  company varchar(180),
  job_title varchar(180),
  country varchar(120),

  trading_experience varchar(80),
  markets text[] not null default '{}',
  trading_styles text[] not null default '{}',
  portfolio_size varchar(80),
  main_goal varchar(180),

  source varchar(120) not null default 'krypnova_landing',

  ip_address inet,
  user_agent text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_leads_created_at on leads(created_at desc);
create index if not exists idx_leads_email on leads(email);
create index if not exists idx_leads_phone on leads(phone);
create index if not exists idx_leads_country on leads(country);
create index if not exists idx_leads_markets on leads using gin(markets);
create index if not exists idx_leads_trading_styles on leads using gin(trading_styles);
create index if not exists idx_leads_trading_experience on leads(trading_experience);

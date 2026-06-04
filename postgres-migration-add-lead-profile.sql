-- Run this if your leads table already exists

alter table leads add column if not exists phone varchar(40);
alter table leads add column if not exists job_title varchar(180);
alter table leads add column if not exists trading_experience varchar(80);
alter table leads add column if not exists markets text[] not null default '{}';
alter table leads add column if not exists trading_styles text[] not null default '{}';
alter table leads add column if not exists portfolio_size varchar(80);
alter table leads add column if not exists main_goal varchar(180);
alter table leads add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_leads_phone on leads(phone);
create index if not exists idx_leads_country on leads(country);
create index if not exists idx_leads_markets on leads using gin(markets);
create index if not exists idx_leads_trading_styles on leads using gin(trading_styles);
create index if not exists idx_leads_trading_experience on leads(trading_experience);

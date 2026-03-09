create table if not exists benchmark_results (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  sites jsonb not null default '[]',
  category_winners jsonb not null default '[]',
  gap_analysis jsonb not null default '[]',
  opportunities jsonb not null default '[]',
  ai_insight jsonb not null default '{}',
  plan_used text default 'free',
  created_at timestamptz default now()
);

alter table benchmark_results enable row level security;

create policy "Users can CRUD own benchmark results"
  on benchmark_results for all using (auth.uid() = user_id);

create index benchmark_results_user_id_idx
  on benchmark_results(user_id);

create index benchmark_results_created_at_idx
  on benchmark_results(created_at desc);

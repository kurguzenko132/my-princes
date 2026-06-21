create table if not exists profiles (
  id uuid primary key,
  email text,
  name text default 'Вика',
  created_at timestamp with time zone default now()
);

create table if not exists level_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  level_id text not null,
  status text default 'started',
  best_score int default 0,
  attempts_count int default 0,
  completed_at timestamp with time zone
);

create table if not exists attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  level_id text not null,
  score int not null,
  duration_seconds int,
  collisions_count int,
  mistakes jsonb default '[]'::jsonb,
  replay jsonb default '[]'::jsonb,
  created_at timestamp with time zone default now()
);

create table if not exists user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  sound_enabled boolean default true,
  trajectory_enabled boolean default true,
  ghost_enabled boolean default true,
  hints_enabled boolean default true,
  updated_at timestamp with time zone default now()
);

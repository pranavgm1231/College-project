-- Enable Row Level Security
alter default privileges in schema public grant all on tables to postgres, anon, authenticated;

-- PROFILES
create table public.profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  bio text,
  avatar_url text,
  credits int default 3, -- Start with 3 credits
  trust_score float default 5.0,
  
  constraint username_length check (char_length(username) >= 3)
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Handle new user signup automatically
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, username)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- SKILLS
create type skill_type as enum ('OFFERED', 'WANTED');
create type skill_level as enum ('BEGINNER', 'INTERMEDIATE', 'EXPERT');

create table public.skills (
  id uuid default extensions.uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  title text not null,
  description text,
  type skill_type not null,
  level skill_level default 'BEGINNER',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.skills enable row level security;

create policy "Skills are viewable by everyone."
  on skills for select
  using ( true );

create policy "Users can create their own skills."
  on skills for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own skills."
  on skills for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own skills."
  on skills for delete
  using ( auth.uid() = user_id );


-- EXCHANGES (Barter Requests)
create type exchange_status as enum ('PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELLED', 'REJECTED');

create table public.exchanges (
  id uuid default extensions.uuid_generate_v4() primary key,
  requester_id uuid references public.profiles(id) not null,
  responder_id uuid references public.profiles(id) not null,
  skill_offered_id uuid references public.skills(id), -- Optional for pure credit request
  skill_requested_id uuid references public.skills(id) not null,
  status exchange_status default 'PENDING',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  completed_at timestamp with time zone
);

alter table public.exchanges enable row level security;

create policy "Users can see exchanges they are involved in."
  on exchanges for select
  using ( auth.uid() = requester_id or auth.uid() = responder_id );

create policy "Users can create exchanges."
  on exchanges for insert
  with check ( auth.uid() = requester_id );

create policy "Users can update exchanges they are involved in."
  on exchanges for update
  using ( auth.uid() = requester_id or auth.uid() = responder_id );


-- MESSAGES
create table public.messages (
  id uuid default extensions.uuid_generate_v4() primary key,
  exchange_id uuid references public.exchanges(id) not null,
  sender_id uuid references public.profiles(id) not null,
  content text not null,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.messages enable row level security;

create policy "Users can view messages in their exchanges."
  on messages for select
  using ( exists (
    select 1 from exchanges
    where exchanges.id = messages.exchange_id
    and (exchanges.requester_id = auth.uid() or exchanges.responder_id = auth.uid())
  ));

create policy "Users can send messages in their exchanges."
  on messages for insert
  with check ( exists (
    select 1 from exchanges
    where exchanges.id = messages.exchange_id
    and (exchanges.requester_id = auth.uid() or exchanges.responder_id = auth.uid())
  ) and auth.uid() = sender_id );


-- REVIEWS & TRUST
create table public.reviews (
  id uuid default extensions.uuid_generate_v4() primary key,
  exchange_id uuid references public.exchanges(id) not null,
  reviewer_id uuid references public.profiles(id) not null,
  reviewee_id uuid references public.profiles(id) not null,
  rating int check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.reviews enable row level security;

create policy "Reviews are viewable by everyone."
  on reviews for select
  using ( true );

create policy "Users can create reviews for completed exchanges."
  on reviews for insert
  with check ( auth.uid() = reviewer_id );

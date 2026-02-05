-- Function to atomically increment/decrement credits
create or replace function increment_credits(user_id uuid, amount int)
returns void
language plpgsql
security definer
as $$
begin
  update public.profiles
  set credits = credits + amount
  where id = user_id;
end;
$$;

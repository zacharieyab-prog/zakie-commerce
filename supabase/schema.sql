-- Zaki Commerce approval queue foundation
-- Apply in a Supabase project's SQL editor.
-- RLS is the enforcement boundary: each signed-in account sees and edits only its rows.
-- Approval status is a decision record. This schema triggers no external action.

create table if not exists public.approval_queue (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  action_type text not null check (action_type in (
    'product_catalogue',
    'supplier_contact',
    'customer_commitment',
    'order_fulfilment',
    'payment_purchase',
    'subscription_service',
    'marketing_advertising',
    'other'
  )),
  details text not null check (char_length(details) between 1 and 2000),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  decided_at timestamptz,
  constraint approval_decision_timestamp check (
    (status = 'pending' and decided_at is null)
    or (status in ('approved', 'rejected') and decided_at is not null)
  )
);

create index if not exists approval_queue_owner_created_idx
  on public.approval_queue (owner_id, created_at desc);

alter table public.approval_queue enable row level security;

revoke all on public.approval_queue from anon;
grant select, insert, update, delete on public.approval_queue to authenticated;

drop policy if exists "Users can view their own approval proposals" on public.approval_queue;
create policy "Users can view their own approval proposals"
  on public.approval_queue for select to authenticated
  using ((select auth.uid()) = owner_id);

drop policy if exists "Users can add their own approval proposals" on public.approval_queue;
create policy "Users can add their own approval proposals"
  on public.approval_queue for insert to authenticated
  with check ((select auth.uid()) = owner_id);

drop policy if exists "Users can update their own approval proposals" on public.approval_queue;
create policy "Users can update their own approval proposals"
  on public.approval_queue for update to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

drop policy if exists "Users can remove their own approval proposals" on public.approval_queue;
create policy "Users can remove their own approval proposals"
  on public.approval_queue for delete to authenticated
  using ((select auth.uid()) = owner_id);

-- ==========================================
-- KinKeep Database Schema for Supabase
-- ==========================================

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Create contacts table
create table if not exists public.contacts (
    id uuid primary key default gen_random_uuid(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    full_name text not null,
    relationship text not null,
    phone_number text,
    email text,
    address text,
    photo_url text,
    added_by uuid references auth.users(id) on delete cascade
);

-- Enable Row Level Security (RLS)
alter table public.contacts enable row level security;

-- Policy: Any authenticated user can view contacts
create policy "Authenticated users can view contacts"
    on public.contacts
    for select
    to authenticated
    using (true);

-- Policy: Any authenticated user can insert contacts
create policy "Authenticated users can insert contacts"
    on public.contacts
    for insert
    to authenticated
    with check (auth.uid() = added_by);

-- Policy: Any authenticated user can update contacts
create policy "Authenticated users can update contacts"
    on public.contacts
    for update
    to authenticated
    using (true)
    with check (true);

-- Policy: Any authenticated user can delete contacts
create policy "Authenticated users can delete contacts"
    on public.contacts
    for delete
    to authenticated
    using (true);

-- Create index for faster querying by user or relationship
create index if not exists idx_contacts_added_by on public.contacts(added_by);
create index if not exists idx_contacts_relationship on public.contacts(relationship);
create index if not exists idx_contacts_full_name on public.contacts(full_name);

-- ==========================================
-- Supabase Storage Setup for Avatar Photos
-- ==========================================
-- Create 'avatars' bucket for relative & friend photos
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

-- Storage RLS: Public read access
create policy "Public Access to Avatar Photos"
    on storage.objects for select
    to public
    using (bucket_id = 'avatars');

-- Storage RLS: Authenticated users can upload photos
create policy "Authenticated users can upload avatar photos"
    on storage.objects for insert
    to authenticated
    with check (bucket_id = 'avatars');

-- Storage RLS: Authenticated users can update/delete photos
create policy "Authenticated users can update avatar photos"
    on storage.objects for update
    to authenticated
    using (bucket_id = 'avatars');

create policy "Authenticated users can delete avatar photos"
    on storage.objects for delete
    to authenticated
    using (bucket_id = 'avatars');

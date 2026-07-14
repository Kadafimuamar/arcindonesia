create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name varchar(100) not null,
  role varchar(20) not null default 'reader',
  avatar_url text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_role_check check (role in ('admin', 'reader'))
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title varchar(200) not null,
  slug varchar(220) not null unique,
  excerpt text not null,
  content text not null,
  cover_image_url text null,
  status varchar(20) not null default 'draft',
  author_id uuid not null references public.profiles(id),
  seo_title varchar(200) null,
  seo_description varchar(320) null,
  published_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  search_vector tsvector generated always as (
    setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(excerpt, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(content, '')), 'C')
  ) stored,
  constraint posts_status_check check (status in ('draft', 'published', 'archived'))
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_name varchar(80) not null,
  author_email varchar(254) not null,
  content varchar(1000) not null,
  status varchar(20) not null default 'visible',
  ip_hash varchar(128) null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  constraint comments_status_check check (status in ('visible', 'hidden'))
);

create index if not exists posts_slug_idx on public.posts(slug);
create index if not exists posts_status_idx on public.posts(status);
create index if not exists posts_published_at_idx on public.posts(published_at desc);
create index if not exists posts_author_id_idx on public.posts(author_id);
create index if not exists posts_created_at_idx on public.posts(created_at desc);
create index if not exists posts_search_vector_idx on public.posts using gin(search_vector);
create index if not exists comments_post_id_idx on public.comments(post_id);
create index if not exists comments_status_idx on public.comments(status);
create index if not exists comments_created_at_idx on public.comments(created_at desc);
create index if not exists comments_ip_hash_idx on public.comments(ip_hash);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.search_posts(
  search_query text,
  page_number integer default 1,
  page_size integer default 6,
  sort_order text default 'latest'
)
returns table (
  id uuid,
  title varchar,
  slug varchar,
  excerpt text,
  content text,
  cover_image_url text,
  status varchar,
  author_id uuid,
  author_name varchar,
  seo_title varchar,
  seo_description varchar,
  published_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz,
  deleted_at timestamptz,
  total_count bigint
)
language sql
stable
set search_path = public
as $$
  select
    p.id,
    p.title,
    p.slug,
    p.excerpt,
    p.content,
    p.cover_image_url,
    p.status,
    p.author_id,
    pr.display_name as author_name,
    p.seo_title,
    p.seo_description,
    p.published_at,
    p.created_at,
    p.updated_at,
    p.deleted_at,
    count(*) over() as total_count
  from public.posts p
  join public.profiles pr
    on pr.id = p.author_id
  where p.status = 'published'
    and p.deleted_at is null
    and (
      search_query is null
      or length(trim(search_query)) = 0
      or p.search_vector @@ plainto_tsquery('simple', search_query)
    )
  order by
    case
      when sort_order = 'oldest'
      then p.published_at
    end asc nulls last,
    case
      when sort_order <> 'oldest'
      then p.published_at
    end desc nulls last
  offset greatest(page_number - 1, 0) * greatest(page_size, 1)
  limit greatest(page_size, 1);
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
before update on public.posts
for each row
execute function public.set_updated_at();

drop trigger if exists comments_set_updated_at on public.comments;
create trigger comments_set_updated_at
before update on public.comments
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;

drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select" on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "profiles_admin_select" on public.profiles;
create policy "profiles_admin_select" on public.profiles
for select
using (public.is_admin());

drop policy if exists "profiles_admin_update" on public.profiles;
create policy "profiles_admin_update" on public.profiles
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update" on public.profiles
for update
using (auth.uid() = id)
with check (
  auth.uid() = id
  and role = (select role from public.profiles where id = auth.uid())
);

drop policy if exists "posts_public_select" on public.posts;
create policy "posts_public_select" on public.posts
for select
using (status = 'published' and deleted_at is null);

drop policy if exists "posts_admin_select" on public.posts;
create policy "posts_admin_select" on public.posts
for select
using (public.is_admin());

drop policy if exists "posts_admin_insert" on public.posts;
create policy "posts_admin_insert" on public.posts
for insert
with check (public.is_admin());

drop policy if exists "posts_admin_update" on public.posts;
create policy "posts_admin_update" on public.posts
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "posts_admin_delete" on public.posts;
create policy "posts_admin_delete" on public.posts
for delete
using (public.is_admin());

drop policy if exists "comments_public_select" on public.comments;
create policy "comments_public_select" on public.comments
for select
using (
  status = 'visible'
  and deleted_at is null
  and exists (
    select 1
    from public.posts
    where posts.id = comments.post_id
      and posts.status = 'published'
      and posts.deleted_at is null
  )
);

drop policy if exists "comments_admin_select" on public.comments;
create policy "comments_admin_select" on public.comments
for select
using (public.is_admin());

drop policy if exists "comments_admin_update" on public.comments;
create policy "comments_admin_update" on public.comments
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "comments_admin_delete" on public.comments;
create policy "comments_admin_delete" on public.comments
for delete
using (public.is_admin());

insert into storage.buckets (id, name, public)
values ('post-covers', 'post-covers', true)
on conflict (id) do nothing;

drop policy if exists "post_covers_public_read" on storage.objects;
create policy "post_covers_public_read" on storage.objects
for select
using (bucket_id = 'post-covers');

drop policy if exists "post_covers_admin_insert" on storage.objects;
create policy "post_covers_admin_insert" on storage.objects
for insert
with check (bucket_id = 'post-covers' and public.is_admin());

drop policy if exists "post_covers_admin_update" on storage.objects;
create policy "post_covers_admin_update" on storage.objects
for update
using (bucket_id = 'post-covers' and public.is_admin())
with check (bucket_id = 'post-covers' and public.is_admin());

drop policy if exists "post_covers_admin_delete" on storage.objects;
create policy "post_covers_admin_delete" on storage.objects
for delete
using (bucket_id = 'post-covers' and public.is_admin());

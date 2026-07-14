-- Jadikan user Supabase tertentu sebagai admin.
-- Ganti UUID di bawah dengan auth.users.id yang valid.

insert into public.profiles (id, display_name, role)
values ('00000000-0000-0000-0000-000000000000', 'Admin RangkumanKu', 'admin')
on conflict (id) do update
set display_name = excluded.display_name,
    role = 'admin';

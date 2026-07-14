# Database RangkumanKu

## Tabel

### `profiles`
- Menyimpan metadata user Supabase Auth.
- Role yang valid: `admin`, `reader`.

### `posts`
- Menyimpan artikel blog.
- Status: `draft`, `published`, `archived`.
- Soft delete via `deleted_at`.
- Full-text search via `search_vector`.

### `comments`
- Menyimpan komentar pembaca.
- Status: `visible`, `hidden`.
- Email hanya ditampilkan di area admin.
- Soft delete via `deleted_at`.

## Relasi
- `profiles.id -> auth.users.id`
- `posts.author_id -> profiles.id`
- `comments.post_id -> posts.id`

## Trigger
- `set_updated_at()` untuk `profiles`, `posts`, dan `comments`.

## RLS
- `profiles`: self select/update terbatas, admin select/update penuh.
- `posts`: publik hanya baca post published non-deleted, admin CRUD.
- `comments`: publik hanya baca visible comment untuk post published, admin select/update/delete.

## Storage
- Bucket publik `post-covers`.
- Publik dapat membaca cover.
- Hanya admin yang dapat insert/update/delete object.

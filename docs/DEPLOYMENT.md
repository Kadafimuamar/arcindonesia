# Deployment RangkumanKu

## 1. Setup Supabase
1. Buat project Supabase baru.
2. Salin `Project URL`, `anon key`, dan `service role key`.
3. Jalankan migration SQL pada folder `supabase/migrations/`.
4. Jalankan `supabase/seed.sql` setelah mengatur `app.settings.seed_admin_id` bila ingin seed data.
5. Buat bucket `post-covers` bila belum dibuat otomatis oleh migration.

## 2. Buat Admin Pertama
1. Buat user lewat Supabase Auth dashboard atau alur invite internal.
2. Ambil `auth.users.id` user tersebut.
3. Jalankan SQL pada `supabase/set-admin.sql` dengan mengganti UUID contoh.

## 3. Environment Vercel
Isi variabel berikut pada Vercel:
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `IP_HASH_SECRET`
- `COMMENT_RATE_LIMIT_PER_HOUR`

## 4. Deploy ke Vercel
1. Push repository ke Git provider.
2. Import project ke Vercel.
3. Pastikan framework terdeteksi sebagai Next.js.
4. Isi seluruh environment variable.
5. Jalankan deployment production.

## 5. Verifikasi
- Homepage menampilkan post published.
- Login admin berhasil.
- CRUD tulisan berjalan.
- Upload cover berhasil.
- Komentar publik dan moderasi admin berjalan.

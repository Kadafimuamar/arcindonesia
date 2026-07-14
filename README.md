# RangkumanKu

RangkumanKu adalah aplikasi blog editorial berbahasa Indonesia berbasis Next.js App Router, Supabase, TypeScript strict, dan Tailwind CSS.

## Fitur
- Homepage publik dengan featured article, artikel terbaru, dan pagination.
- Arsip semua tulisan dan pencarian full-text.
- Detail tulisan Markdown lengkap dengan share action, JSON-LD, dan komentar.
- Login admin dengan Supabase Auth.
- Dashboard admin, CRUD tulisan, upload cover image, dan moderasi komentar.
- Validasi Zod, rate limit komentar, IP hashing, RLS, dan storage policy.

## Prasyarat
- Node.js 20+
- npm 10+
- Project Supabase

## Instalasi
```bash
npm install
cp .env.example .env.local
```

## Environment Variables
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `IP_HASH_SECRET`
- `COMMENT_RATE_LIMIT_PER_HOUR`

## Menjalankan Development
```bash
npm run dev
```

## Setup Supabase
1. Jalankan migration pada `supabase/migrations/`.
2. Isi bucket `post-covers` melalui migration atau dashboard.
3. Buat admin pertama menggunakan `supabase/set-admin.sql`.
4. Jalankan `supabase/seed.sql` bila ingin data contoh.

## Menjalankan Migration
```bash
supabase db push
```

## Menjalankan Seed
Atur `app.settings.seed_admin_id` lalu jalankan:

```bash
psql -f supabase/seed.sql
```

## Test
```bash
npm test
npm run test:e2e
```

## Build Production
```bash
npm run build
```

## Deployment Vercel
Lihat detail lengkap pada `docs/DEPLOYMENT.md`.

## Troubleshooting
- Jika halaman publik menampilkan pesan konfigurasi, isi env Supabase publik.
- Jika login berhasil tetapi akses admin ditolak, cek role user pada `profiles`.
- Jika upload cover gagal, pastikan bucket `post-covers` dan policy storage sudah aktif.

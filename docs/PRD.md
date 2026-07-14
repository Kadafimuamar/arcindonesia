# PRD RangkumanKu

## Ringkasan Produk
RangkumanKu adalah web app blog editorial berbahasa Indonesia dengan dua area utama: pengalaman publik untuk membaca dan mencari tulisan, serta area admin untuk mengelola konten dan komentar.

## Tujuan
- Menyajikan artikel published secara cepat dan mudah dibaca.
- Mendukung workflow editorial sederhana: draft, publish, archive, update.
- Menjaga keamanan dasar melalui Supabase Auth, RLS, validasi server-side, dan rate limit komentar.

## Persona
- Pembaca umum yang ingin membaca artikel editorial.
- Admin/editor yang menulis, mempublikasikan, dan memoderasi komentar.

## Fitur Inti
- Homepage dengan featured article dan daftar tulisan terbaru.
- Halaman semua tulisan dengan pagination dan sorting.
- Detail tulisan dengan Markdown, share actions, metadata dinamis, JSON-LD, dan komentar.
- Pencarian berdasarkan judul, excerpt, dan content.
- Login admin berbasis Supabase Auth.
- Dashboard admin, CRUD tulisan, upload cover, dan moderasi komentar.

## Non-Fungsional
- Next.js App Router, TypeScript strict, Tailwind, Supabase.
- Responsive di mobile, tablet, dan desktop.
- Accessible contrast dan focus state yang terlihat.
- Tidak ada secret di client bundle.
- Dokumentasi setup, migration, test, dan deployment lengkap.

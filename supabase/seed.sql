-- Seed aman: ganti nilai app.settings.seed_admin_id dengan UUID user auth yang valid sebelum menjalankan seed.
-- Contoh:
-- alter database postgres set app.settings.seed_admin_id = '00000000-0000-0000-0000-000000000000';

do $$
declare
  seed_admin_id uuid := nullif(current_setting('app.settings.seed_admin_id', true), '')::uuid;
begin
  if seed_admin_id is null then
    raise notice 'Seed dilewati karena app.settings.seed_admin_id belum diatur.';
    return;
  end if;

  insert into public.profiles (id, display_name, role)
  values (seed_admin_id, 'Admin RangkumanKu', 'admin')
  on conflict (id) do update
    set display_name = excluded.display_name,
        role = excluded.role;

  insert into public.posts (title, slug, excerpt, content, status, author_id, published_at, seo_title, seo_description)
  values
    (
      'Membangun Kebiasaan Membaca di Era Serba Cepat',
      'membangun-kebiasaan-membaca-di-era-serba-cepat',
      'Strategi praktis untuk menjaga rutinitas membaca ketika perhatian mudah terpecah.',
      '# Membangun Kebiasaan Membaca\n\nMembaca yang konsisten lahir dari ritme kecil yang dijaga setiap hari.\n\n## Mulai dari durasi pendek\n\nSisihkan 10 sampai 15 menit setiap pagi atau malam.\n\n## Kurangi friksi\n\nSimpan daftar bacaan dan lanjutkan dari perangkat yang paling sering Anda buka.',
      'published',
      seed_admin_id,
      now() - interval '3 day',
      'Membangun Kebiasaan Membaca yang Konsisten',
      'Panduan praktis membangun rutinitas membaca di tengah distraksi digital.'
    ),
    (
      'Mengubah Catatan Riset Menjadi Tulisan yang Jernih',
      'mengubah-catatan-riset-menjadi-tulisan-yang-jernih',
      'Cara menyusun insight dari berbagai sumber menjadi artikel yang runtut dan enak dibaca.',
      '# Mengubah Catatan Menjadi Tulisan\n\nMulailah dari satu pertanyaan utama.\n\n## Kelompokkan temuan\n\nSatukan insight yang serupa dan buang pengulangan.\n\n## Tulis untuk pembaca\n\nFokus pada apa yang perlu dipahami pembaca terlebih dahulu.',
      'published',
      seed_admin_id,
      now() - interval '2 day',
      'Mengubah Catatan Riset Menjadi Artikel',
      'Langkah menyusun catatan dan riset menjadi tulisan editorial yang jelas.'
    ),
    (
      'Mengapa Draft yang Baik Tidak Harus Sempurna',
      'mengapa-draft-yang-baik-tidak-harus-sempurna',
      'Draft pertama yang sehat membantu tim bergerak lebih cepat tanpa kehilangan kualitas akhir.',
      '# Draft Tidak Harus Sempurna\n\nDraft pertama adalah tempat berpikir, bukan tempat bersembunyi.\n\n## Pisahkan menulis dan menyunting\n\nBiarkan struktur lahir lebih dulu, lalu rapikan pada putaran berikutnya.',
      'draft',
      seed_admin_id,
      null,
      'Mengapa Draft Tidak Perlu Sempurna',
      'Refleksi tentang peran draft pertama dalam proses menulis yang sehat.'
    )
  on conflict (slug) do nothing;
end $$;

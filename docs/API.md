# API RangkumanKu

Semua response sukses:

```json
{
  "data": {},
  "error": null,
  "meta": {}
}
```

Semua response gagal:

```json
{
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Pesan aman"
  }
}
```

## Public API

### GET `/api/posts`
- Query: `page`, `pageSize`, `q`, `sort`
- Deskripsi: daftar tulisan published.

### GET `/api/posts/[slug]`
- Deskripsi: detail satu tulisan published.

### GET `/api/search`
- Query: `q`, `page`, `pageSize`, `sort`
- Deskripsi: pencarian tulisan published.

### GET `/api/posts/[slug]/comments`
- Query: `page`, `pageSize`
- Deskripsi: komentar visible untuk tulisan published.

### POST `/api/posts/[slug]/comments`
- Body:
```json
{
  "authorName": "Nama",
  "authorEmail": "email@example.com",
  "content": "Isi komentar",
  "website": ""
}
```
- Deskripsi: membuat komentar publik dengan honeypot dan rate limit per IP hash.

## Admin API

Seluruh endpoint admin butuh session aktif dan role `admin`.

### GET `/api/admin/dashboard`
- Deskripsi: statistik dashboard admin.

### GET `/api/admin/posts`
- Query: `page`, `pageSize`, `q`, `status`, `sort`

### POST `/api/admin/posts`
- Body: payload post JSON.

### GET `/api/admin/posts/[id]`
- Deskripsi: detail post admin.

### PATCH `/api/admin/posts/[id]`
- Body: payload post JSON.

### DELETE `/api/admin/posts/[id]`
- Deskripsi: soft delete post.

### POST `/api/admin/posts/[id]/publish`
- Deskripsi: publish post dan isi `published_at` bila belum ada.

### POST `/api/admin/posts/[id]/draft`
- Deskripsi: ubah post ke draft.

### POST `/api/admin/posts/[id]/archive`
- Deskripsi: archive post.

### GET `/api/admin/comments`
- Query: `page`, `pageSize`, `q`, `status`

### PATCH `/api/admin/comments/[id]?status=visible|hidden`
- Deskripsi: hide atau restore komentar.

### DELETE `/api/admin/comments/[id]`
- Deskripsi: soft delete komentar.

### POST `/api/admin/uploads/cover`
- Body: `multipart/form-data` dengan field `file`.
- Deskripsi: upload cover image ke bucket `post-covers`.

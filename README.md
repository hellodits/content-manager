# Content Manager

Simple CMS buat manage artikel. Backend pake Go + Gin, frontend React + TypeScript.

## Tech Stack

**Backend:** Go, Gin, GORM, MySQL  
**Frontend:** React, TypeScript, Vite, Tailwind CSS

## Setup

### Database

```sql
CREATE DATABASE sharing_vision;
```

### Backend

```bash
cd backend
```

Edit `.env`:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=sharing_vision
```

```bash
go mod download
go run main.go
```

Jalan di `http://localhost:8080`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Jalan di `http://localhost:3000`

## API

| Method | Endpoint | Desc |
|--------|----------|------|
| GET | `/article/:limit/:offset` | List artikel + pagination |
| GET | `/article/:id` | Detail artikel |
| GET | `/article/Publish/` | Artikel published |
| GET | `/article/Draft/` | Artikel draft |
| GET | `/article/Thrash/` | Artikel trashed |
| POST | `/article` | Buat baru |
| PUT | `/article/:id` | Update |
| DELETE | `/article/:id` | Hapus |

Request body:
```json
{
  "title": "Min 20 karakter",
  "content": "Min 200 karakter",
  "category": "Technology",
  "status": "Publish"
}
```

Status: `Publish`, `Draft`, `Thrash`

## Deploy

**Backend (Render):**
- Set env: `PORT`, `CLIENT_ORIGIN`, `DB_DSN`

**Frontend (Vercel):**
- Set env: `VITE_API_URL`

Lihat `.env.example` di masing-masing folder.

## Troubleshooting

- DB ga connect? Cek `.env` dan pastikan MySQL running
- CORS error? Backend harus jalan dulu
- Port bentrok? Ganti di `main.go` atau `vite.config.ts`

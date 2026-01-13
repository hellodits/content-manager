# Content Manager

Aplikasi Content Management System (CMS) sederhana untuk mengelola artikel/post dengan fitur CRUD lengkap. Dibangun menggunakan Go (Gin Framework) untuk backend dan React + TypeScript untuk frontend.

## 🚀 Tech Stack

### Backend
- **Go 1.21** - Bahasa pemrograman
- **Gin** - Web framework
- **GORM** - ORM untuk database
- **MySQL** - Database

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client
- **Lucide React** - Icons

## 📁 Struktur Project

```
├── backend/
│   ├── config/
│   │   └── database.go      # Konfigurasi koneksi database
│   ├── controllers/
│   │   └── post_controller.go # Handler untuk API endpoints
│   ├── models/
│   │   └── post.go          # Model data Post
│   ├── routes/
│   │   └── routes.go        # Definisi routing API
│   ├── .env                 # Environment variables
│   ├── go.mod               # Go dependencies
│   └── main.go              # Entry point backend
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts    # Axios client configuration
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Halaman aplikasi
│   │   ├── types/           # TypeScript type definitions
│   │   ├── App.tsx          # Root component
│   │   └── main.tsx         # Entry point frontend
│   ├── package.json         # Node dependencies
│   └── vite.config.ts       # Vite configuration
│
└── README.md
```

## ✨ Fitur

- **Dashboard** - Melihat semua artikel dengan filter berdasarkan status (Publish, Draft, Thrash)
- **Create Post** - Membuat artikel baru
- **Edit Post** - Mengedit artikel yang sudah ada
- **Delete Post** - Menghapus artikel
- **Preview** - Melihat preview artikel yang sudah dipublish
- **Validasi** - Validasi input pada form (min. 20 karakter untuk title, 200 karakter untuk content)

## 📋 Prerequisites

Pastikan sudah terinstall:

- **Go** >= 1.21 ([Download](https://golang.org/dl/))
- **Node.js** >= 18 ([Download](https://nodejs.org/))
- **MySQL** >= 8.0 ([Download](https://dev.mysql.com/downloads/))

## ⚙️ Instalasi & Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Setup Database MySQL

Buat database baru di MySQL:

```sql
CREATE DATABASE sharing_vision;
```

### 3. Setup Backend

```bash
# Masuk ke folder backend
cd backend

# Copy file environment (jika belum ada)
# Edit file .env sesuai konfigurasi database kamu
```

Edit file `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sharing_vision
```

```bash
# Install dependencies Go
go mod download

# Jalankan backend
go run main.go
```

Backend akan berjalan di `http://localhost:8080`

### 4. Setup Frontend

Buka terminal baru:

```bash
# Masuk ke folder frontend
cd frontend

# Install dependencies
npm install

# Jalankan frontend
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

## 🖥️ Cara Menjalankan

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
go run main.go
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Buka browser dan akses `http://localhost:3000`

### Production Build

**Backend:**
```bash
cd backend
go build -o app.exe main.go
./app.exe
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 🔌 API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/article/:limit/:offset` | Get semua artikel dengan pagination |
| GET | `/article/:id` | Get artikel berdasarkan ID |
| GET | `/article/Publish` | Get artikel dengan status Publish |
| GET | `/article/Draft` | Get artikel dengan status Draft |
| GET | `/article/Thrash` | Get artikel dengan status Thrash |
| POST | `/article` | Buat artikel baru |
| PUT | `/article/:id` | Update artikel |
| DELETE | `/article/:id` | Hapus artikel |

### Contoh Request Body (POST/PUT)

```json
{
  "title": "Judul Artikel Minimal 20 Karakter",
  "content": "Konten artikel yang cukup panjang minimal 200 karakter...",
  "category": "Technology",
  "status": "Publish"
}
```

### Status yang Valid
- `Publish` - Artikel dipublikasikan
- `Draft` - Artikel masih draft
- `Thrash` - Artikel di tempat sampah

## 🗄️ Database Schema

Tabel `posts`:

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key, auto increment |
| title | VARCHAR(200) | Judul artikel |
| content | TEXT | Isi artikel |
| category | VARCHAR(100) | Kategori artikel |
| status | VARCHAR(20) | Status: Publish/Draft/Thrash |
| created_date | DATETIME | Tanggal dibuat |
| updated_date | DATETIME | Tanggal diupdate |

## 🛠️ Troubleshooting

### Backend tidak bisa connect ke database
- Pastikan MySQL sudah running
- Cek konfigurasi di file `.env`
- Pastikan database `sharing_vision` sudah dibuat

### Frontend error CORS
- Pastikan backend sudah running di port 8080
- CORS sudah dikonfigurasi untuk `localhost:3000` dan `localhost:5173`

### Port sudah digunakan
- Backend default: 8080
- Frontend default: 3000
- Ubah port di `main.go` atau `vite.config.ts` jika diperlukan

## 📝 License

MIT License

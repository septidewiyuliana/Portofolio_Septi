# Portofolio — Septi Dewi Yuliana

Website portofolio pribadi yang minimalis, modern, dan sepenuhnya responsif (desktop & mobile).
Dibangun dengan HTML, CSS, dan JavaScript murni — tanpa framework, tanpa build step.

**Live:** https://septidewiyuliana.github.io/Portofolio_Septi/

---

## ✨ Fitur

- **Desain minimalis & modern** — dark mode sebagai default, plus light mode yang tersimpan di `localStorage`.
- **Animasi halus**
  - Preloader dengan animasi logo & loading bar
  - Efek *typing* pada peran di hero section
  - *Scroll reveal* dengan `IntersectionObserver` dan delay bertingkat
  - Angka statistik yang berjalan (count-up) saat masuk viewport
  - Progress bar keahlian yang terisi otomatis
  - Blob gradient yang mengapung, cursor glow, dan parallax halus pada kartu hero
  - Timeline dengan titik yang menyala saat di-hover
- **Navigasi cerdas** — sticky navbar dengan efek blur, tautan aktif mengikuti posisi scroll, scroll progress bar, menu hamburger di mobile, dan tombol back-to-top.
- **Fully responsive** — breakpoint di 1024px, 920px, 720px, dan 460px; tipografi memakai `clamp()`.
- **Aksesibel** — atribut ARIA, focus ring yang jelas, serta menghormati `prefers-reduced-motion`.
- **Tanpa dependensi** — hanya Google Fonts (dengan fallback font sistem).

## 📁 Struktur

```
.
├── index.html              # Struktur halaman
├── assets/
│   ├── css/style.css       # Seluruh styling, tema, dan animasi
│   └── js/main.js          # Interaksi & animasi
├── .nojekyll               # Agar GitHub Pages tidak memproses folder berawalan _
└── README.md
```

## 🚀 Menjalankan secara lokal

Cukup buka `index.html` di browser, atau jalankan server statis:

```bash
python -m http.server 8080
# lalu buka http://localhost:8080
```

## 🌐 Deploy ke GitHub Pages

1. Buka **Settings → Pages** pada repositori ini.
2. Pada **Source**, pilih branch `main` dan folder `/ (root)`.
3. Simpan, lalu situs akan tersedia di `https://septidewiyuliana.github.io/Portofolio_Septi/`.

## 🎨 Kustomisasi

| Ingin mengubah | Lokasi |
| --- | --- |
| Warna aksen | `assets/css/style.css` → `:root` (`--accent`, `--accent-2`, `--grad`) |
| Isi konten | `index.html` (setiap section sudah diberi komentar) |
| Teks efek typing | `assets/js/main.js` → variabel `ROLES` |
| Nilai progress bar | `index.html` → atribut `data-level` pada `.bar` |
| Angka statistik | `index.html` → atribut `data-count` dan `data-suffix` |

## 📬 Kontak

- **Email:** septidewiyuliana@gmail.com
- **WhatsApp:** 0812 1647 4634
- **Lokasi:** Semarang, Indonesia

---

© Septi Dewi Yuliana. All rights reserved.

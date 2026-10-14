# Nge-Sport — Platform Turnamen E-Sports + Sponsor Matchmaking

Mock-up fungsional BMC Kelompok 14 (Ide 2). Style Neobrutalism gelap + Retro Pop, font Lexend Mega.

## Cara jalanin

```bash
npm install
npm run db:reset   # isi seed: 3 organizer, 5 sponsor, 12 player, 4 turnamen, 6 proposal, 10 LFG
npm run dev        # buka http://localhost:3000
```

## Login & akses

Tanpa login kamu cuma bisa lihat halaman publik: **Beranda**, **Daftar Turnamen**, dan **Detail Turnamen**.

Untuk memakai fitur, masuk lewat `/login`. Ada tiga akun contoh (klik "PILIH AKUN"):

| Role | Email | Password |
|---|---|---|
| Panitia (ORGANIZER) | `bem@undip.ac.id` | apa saja (mock) |
| Sponsor (SPONSOR) | `kopi@ndalem.id` | apa saja (mock) |
| Player (PLAYER) | `player1@ngesport.id` | apa saja (mock) |

Login tanpa password sungguhan — cukup email, cookie sesi 7 hari. Bisa ganti role cepat dari Navbar, dan logout lewat tombol **Keluar**.

Halaman yang butuh login:
- Role spesifik: `/organizer/*` (Panitia), `/sponsor` (Sponsor), `/player` (Player).
- Role apa saja: `/lfg`, `/sponsors`, `/sponsors/[id]`, `/help`.

## Alur demo 10 menit

1. **(1 mnt) Landing** — tamu lihat 3 masalah → 3 solusi + turnamen yang sedang live. Klik fitur → dilempar ke `/login`.
2. **(1 mnt) Masuk** — klik "Masuk sebagai Panitia" → masuk dashboard.
3. **(3 mnt) Panitia** — `/organizer` → Kelola MLBB Campus Cup (6 tim) → Generate Bracket (2 BYE otomatis) → input 2 skor → pemenang maju ★ → final → FINISHED.
4. **(2 mnt) Proposal** — `+ Proposal` → isi target dana → simpan ke Directory → preview template + Cetak/PDF.
5. **(2 mnt) Sponsor** — ganti role Sponsor → `/sponsors/[id]` → danai Rp 1jt → fee Rp 100rb, panitia Rp 900rb → `/sponsor` booking slot iklan → banner muncul di halaman turnamen.
6. **(1 mnt) Player** — ganti role Player → `/player` daftar tim/solo (solo +fee Rp 2.500) → `/lfg` Ajak → Tim Terbentuk ✓.
7. **(1 mnt) Billing** — `/organizer/billing`: SaaS + success fee 10% + badge langganan diskon 10%.

## Yang di-mock

- Auth: login mock (email saja, tanpa password sungguhan), sesi cookie `ngesport_session`. Akun contoh otomatis jalan walau DB kosong (fallback Vercel).
- Bayar: `mockPay` 1,2 dtk selalu sukses, ref `MOCK-XXXXXX`.
- Proposal: template string tanpa AI. Stream: iframe YouTube + banner statis.
- Format: single elimination saja. Tarif SaaS/loyalty asumsi kelompok, success fee 10% dari BMC.

## Struktur

```
docs/ARSITEKTUR.md   # spec lengkap (referensi)
prisma/              # schema + seed
src/app/             # routes (login, organizer, sponsor, player, tournaments, ...)
src/components/      # layout + ui
src/lib/             # session, bracket, fees, proposal, db, demo fallback
```

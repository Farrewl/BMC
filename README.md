# LombaEsport — Platform Turnamen E-Sports + Sponsor Matchmaking

Mock-up fungsional BMC Kelompok 14 (Ide 2). Style Neobrutalism gelap + Retro Pop, font Lexend Mega.

## Cara jalanin

```bash
npm install
npm run db:reset   # isi seed: 3 organizer, 5 sponsor, 12 player, 4 turnamen, 6 proposal, 10 LFG
npm run dev        # buka http://localhost:3000
```

## Alur demo 10 menit

1. **(1 mnt) Landing** — 3 masalah → 3 solusi, tombol Coba Demo + Lihat Turnamen.
2. **(3 mnt) Panitia** — `/organizer` → Kelola MLBB Campus Cup (6 tim) → Generate Bracket (2 BYE otomatis) → input 2 skor → pemenang maju ★ → final → FINISHED.
3. **(2 mnt) Proposal** — `+ Proposal` → isi target dana → simpan ke Directory → preview template + Cetak/PDF.
4. **(2 mnt) Sponsor** — RoleSwitcher Sponsor → `/sponsors/[id]` → Danai Rp 1jt → fee Rp 100rb, panitia Rp 900rb → `/sponsor` booking slot iklan → banner muncul di halaman turnamen.
5. **(1 mnt) Player** — `/player` daftar tim/solo (solo +fee Rp 2.500) → `/lfg` Ajak → Tim Terbentuk ✓.
6. **(1 mnt) Billing** — `/organizer/billing`: SaaS + success fee 10% + badge langganan diskon 10%.

## Yang di-mock

- Auth: RoleSwitcher cookie `lombaesport_session`, tanpa login sungguhan.
- Bayar: `mockPay` 1,2 dtk selalu sukses, ref `MOCK-XXXXXX`. Tulisan Mode Demo di semua halaman.
- Proposal: template string tanpa AI. Stream: iframe YouTube + banner statis.
- Format: single elimination saja. Tarif SaaS/loyalty asumsi kelompok, success fee 10% dari BMC.

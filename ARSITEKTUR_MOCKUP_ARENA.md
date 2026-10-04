# ARSITEKTUR & SPEC MOCK-UP — Platform Manajemen Turnamen E-Sports + Sponsor Matchmaking

> Dokumen ini dipakai sebagai **referensi utama untuk AI coding agent (opencode)**.
> Sumber: Business Model Canvas Kelompok 14 (Ide 2). Tujuan: **mock-up fungsional**, bukan produk production-ready.
> Nama kerja produk: **ARENA** (ganti bebas).

---

## 0. Cara Memakai Dokumen Ini di opencode

1. Taruh file ini di root repo sebagai `SPEC.md` (atau `AGENTS.md` kalau mau selalu dibaca otomatis).
2. Jalankan fase build **satu per satu** (lihat Bagian 11). Jangan minta agent membangun semuanya sekaligus.
3. Setiap selesai fase: jalankan `npm run dev`, cek checklist "Definition of Done" fase tersebut, baru lanjut.
4. Aturan emas untuk agent: **kalau sebuah fitur ditandai `MOCK` atau `SKIP`, jangan dibuat sungguhan.** Cukup UI + data dummy.

---

## 1. Ringkasan Produk (dari BMC)

Platform web SaaS B2B2C yang mengotomatisasi siklus turnamen e-sports skala kampus/komunitas.

| Pilar | Fitur | Penerima manfaat |
|---|---|---|
| **Performance** | Auto-Bracket + registrasi terpusat | Panitia / EO |
| **Newness** | Sponsor Directory (matchmaking proposal ↔ UMKM) | Panitia & UMKM |
| **Newness** | LFG (Looking For Group) | Solo player |
| **Customization** | Embedded live stream + slot iklan digital UMKM | UMKM & penonton |

**Tiga aktor (role):**
- `ORGANIZER` — Panitia/BEM/EO: bikin turnamen, kelola bracket, ajukan proposal sponsor.
- `SPONSOR` — Mitra UMKM: telusuri proposal, danai acara, beli slot iklan.
- `PLAYER` — Gamer: daftar turnamen, cari tim via LFG, tonton stream.

**Revenue (harus terlihat di UI):**
- **SaaS Fee** — biaya per event dari organizer.
- **Success Fee 10%** — dari dana sponsor yang berhasil difasilitasi.
- **Convenience Fee** — biaya admin tambahan saat solo player bayar tiket.

---

## 2. Scope Mock-Up: Apa yang Dibuat Sungguhan vs Di-mock

Legenda: ✅ **REAL** = logika benar-benar jalan · 🟡 **MOCK** = UI + data dummy, tombol bisa diklik tapi hasil palsu · ⛔ **SKIP** = tidak dibuat, cukup disebut di README.

| # | Fitur | Status | Catatan |
|---|---|---|---|
| 1 | Landing page + penjelasan value proposition | ✅ | Statis, tapi harus rapi (ini bahan presentasi) |
| 2 | Auth | 🟡 | **Tidak ada login sungguhan.** Pakai *role switcher* (dropdown "Masuk sebagai…") |
| 3 | CRUD Turnamen (buat, edit, publish) | ✅ | |
| 4 | Registrasi peserta/tim + daftar peserta | ✅ | |
| 5 | **Auto-Bracket generator** (single elimination) | ✅ | **Fitur inti. Wajib jalan.** |
| 6 | Input skor & bracket maju otomatis | ✅ | Inti kedua |
| 7 | Sponsor Directory (list + filter + detail proposal) | ✅ | |
| 8 | Ajukan/Terima deal sponsor + hitung fee 10% | ✅ | Perhitungan nyata, uang tidak nyata |
| 9 | Auto-Proposal Generator | 🟡 | Template string + isian form (tanpa AI). Output bisa ditampilkan/di-print |
| 10 | **LFG** (post, filter, "ajak gabung") | ✅ | Inti ketiga |
| 11 | Tim terbentuk dari LFG | 🟡 | Cukup ubah status post jadi "Tim Terbentuk" |
| 12 | Live stream embed + slot iklan | 🟡 | `<iframe>` YouTube/Twitch + banner iklan statis rotasi |
| 13 | Checkout tiket + Convenience Fee | 🟡 | Halaman checkout palsu, rincian biaya dihitung, "bayar" langsung sukses |
| 14 | Payment gateway (Midtrans/Xendit) | ⛔ | Diganti `MockPayment` |
| 15 | Pencairan dana otomatis | ⛔ | Cukup status `DISBURSED` yang diubah manual |
| 16 | Dashboard organizer / sponsor / player | ✅ | Ringkasan dari data DB |
| 17 | Helpdesk | 🟡 | Form kirim tiket → tersimpan, tampil di daftar |
| 18 | Promo loyalitas | 🟡 | Badge "Organizer Langganan: diskon 10% SaaS Fee" berdasarkan jumlah event |
| 19 | Notifikasi real-time, email, WhatsApp | ⛔ | |
| 20 | Double-elimination, round-robin, Swiss | ⛔ | Boleh jadi "coming soon" |
| 21 | Matchmaking AI untuk LFG | ⛔ | Cukup filter manual (game, rank, role) |

---

## 3. Tech Stack (dipilih supaya cepat jadi & mudah dipahami agent)

| Lapisan | Pilihan | Alasan |
|---|---|---|
| Framework | **Next.js 14+ (App Router) + TypeScript** | Full-stack satu repo, route handler = backend |
| UI | **Tailwind CSS + shadcn/ui + lucide-react** | Cepat bikin tampilan bagus |
| DB | **SQLite + Prisma ORM** | Nol setup, file lokal, mudah di-reset |
| Validasi | **Zod** | Validasi form & API |
| State/form | React Hook Form + Server Actions (atau route handler) | |
| Bracket viz | **Komponen custom (CSS grid/flex + SVG connector)** | Library bracket sering rewel; custom lebih terkontrol |
| Chart (opsional) | Recharts | Untuk dashboard |
| Deploy (opsional) | Vercel (ganti SQLite → Turso/Neon bila perlu) | Demo bisa jalan lokal saja |

**Aturan teknis untuk agent:**
- Bahasa UI: **Bahasa Indonesia** (santai-profesional). Kode/variabel: Inggris.
- Mata uang: format `Rp 1.250.000` via `Intl.NumberFormat('id-ID')`.
- Tidak ada secret/API key. Semua integrasi eksternal di-mock.
- Semua logika bisnis (bracket, fee) taruh di `src/lib/` sebagai **pure function** agar mudah dites.

---

## 4. Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────┐
│                      BROWSER (Next.js)                  │
│  Landing │ Organizer UI │ Sponsor UI │ Player UI        │
│          └── RoleSwitcher (cookie: role + userId) ──┐   │
└───────────────────────┬─────────────────────────────┼───┘
                        │ Server Actions / Route Handlers
┌───────────────────────▼─────────────────────────────────┐
│                  APPLICATION LAYER (src/lib)            │
│  bracket.ts   fees.ts   proposal.ts   lfg.ts   auth.ts  │
│  (pure logic)                         (mock session)    │
└───────────────────────┬─────────────────────────────────┘
                        │ Prisma Client
┌───────────────────────▼─────────────────────────────────┐
│                  SQLite (dev.db) + seed.ts              │
└─────────────────────────────────────────────────────────┘

 Integrasi eksternal (SEMUA MOCK):
  MockPayment ─ pura-pura Midtrans/Xendit
  YouTube/Twitch iframe ─ satu-satunya embed "nyata"
```

**Mock auth:** cookie `arena_session = { userId, role }`. `RoleSwitcher` di navbar mengganti cookie dan redirect ke dashboard role terkait. Middleware cukup memblok akses lintas-role secara kasar (opsional).

---

## 5. Struktur Folder

```
arena/
├─ SPEC.md                      ← file ini
├─ prisma/
│  ├─ schema.prisma
│  └─ seed.ts                   ← data dummy realistis (WAJIB bagus)
├─ src/
│  ├─ app/
│  │  ├─ (public)/
│  │  │  ├─ page.tsx                        # Landing
│  │  │  ├─ tournaments/page.tsx            # Daftar turnamen publik
│  │  │  ├─ tournaments/[id]/page.tsx       # Detail + bracket + stream + daftar
│  │  │  ├─ lfg/page.tsx                    # Papan LFG
│  │  │  └─ sponsors/page.tsx               # Sponsor Directory (publik/preview)
│  │  ├─ organizer/
│  │  │  ├─ dashboard/page.tsx
│  │  │  ├─ tournaments/new/page.tsx
│  │  │  ├─ tournaments/[id]/manage/page.tsx   # peserta, generate bracket, skor
│  │  │  ├─ tournaments/[id]/sponsorship/page.tsx # proposal generator + deal
│  │  │  └─ billing/page.tsx                   # SaaS fee + success fee
│  │  ├─ sponsor/
│  │  │  ├─ dashboard/page.tsx
│  │  │  ├─ directory/page.tsx                 # telusuri proposal
│  │  │  ├─ proposals/[id]/page.tsx            # detail + "Danai"
│  │  │  └─ ads/page.tsx                       # pilih slot iklan
│  │  ├─ player/
│  │  │  ├─ dashboard/page.tsx
│  │  │  └─ checkout/[registrationId]/page.tsx # mock bayar + convenience fee
│  │  ├─ help/page.tsx                         # Helpdesk
│  │  └─ api/ (atau pakai server actions)
│  ├─ components/
│  │  ├─ layout/ (Navbar, RoleSwitcher, Footer)
│  │  ├─ bracket/ (BracketView, MatchCard, ScoreDialog)
│  │  ├─ tournament/ (TournamentCard, RegisterForm, ParticipantTable)
│  │  ├─ sponsor/ (ProposalCard, DealDialog, FeeBreakdown)
│  │  ├─ lfg/ (LfgCard, LfgForm, LfgFilter)
│  │  ├─ stream/ (StreamEmbed, AdSlotBanner)
│  │  └─ ui/ (shadcn)
│  ├─ lib/
│  │  ├─ db.ts                # Prisma singleton
│  │  ├─ session.ts           # mock session (cookie)
│  │  ├─ bracket.ts           # ★ generateBracket, advanceWinner
│  │  ├─ fees.ts              # ★ hitung SaaS / success / convenience fee
│  │  ├─ proposal.ts          # ★ template Auto-Proposal Generator
│  │  ├─ format.ts            # rupiah, tanggal
│  │  └─ constants.ts         # tarif, daftar game
│  └─ middleware.ts (opsional)
├─ tests/
│  ├─ bracket.test.ts         # WAJIB ada (logika paling rawan bug)
│  └─ fees.test.ts
└─ README.md                  # cara jalanin + daftar yang di-mock
```

---

## 6. Model Data (Prisma)

```prisma
datasource db { provider = "sqlite"; url = "file:./dev.db" }
generator client { provider = "prisma-client-js" }

enum Role              { ORGANIZER SPONSOR PLAYER }
enum TournamentStatus  { DRAFT OPEN ONGOING FINISHED }
enum MatchStatus       { PENDING READY DONE }
enum ProposalStatus    { OPEN FUNDED CLOSED }
enum DealStatus        { PENDING ACCEPTED PAID DISBURSED REJECTED }
enum PaymentStatus     { UNPAID PAID }
enum LfgStatus         { OPEN TEAM_FORMED CLOSED }
enum AdSlotPlacement   { PRE_ROLL SIDE_BANNER BREAK_BANNER }

model User {
  id          String   @id @default(cuid())
  name        String
  email       String   @unique
  role        Role
  // profil opsional
  orgName     String?          // untuk ORGANIZER / SPONSOR
  city        String?
  createdAt   DateTime @default(now())

  tournaments   Tournament[]  @relation("Organizer")
  registrations Registration[]
  lfgPosts      LfgPost[]
  deals         SponsorDeal[]
  adBookings    AdBooking[]
  tickets       HelpTicket[]
}

model Tournament {
  id            String   @id @default(cuid())
  organizerId   String
  organizer     User     @relation("Organizer", fields: [organizerId], references: [id])
  title         String
  game          String            // "Mobile Legends", "Valorant", dst
  description   String
  startDate     DateTime
  maxTeams      Int               // 4,8,16,32
  teamSize      Int      @default(5)
  entryFee      Int      @default(0)   // per tim/orang, rupiah
  prizePool     Int      @default(0)
  status        TournamentStatus @default(DRAFT)
  streamUrl     String?           // URL embed YouTube/Twitch
  saasFeePaid   Boolean  @default(false)
  createdAt     DateTime @default(now())

  registrations Registration[]
  matches       Match[]
  proposals     SponsorProposal[]
  adSlots       AdSlot[]
}

model Registration {
  id            String   @id @default(cuid())
  tournamentId  String
  tournament    Tournament @relation(fields: [tournamentId], references: [id])
  userId        String                // pendaftar (kapten / solo)
  user          User     @relation(fields: [userId], references: [id])
  teamName      String
  members       String                // JSON array nama anggota
  isSoloPlayer  Boolean  @default(false)
  seed          Int?                  // urutan seed
  paymentStatus PaymentStatus @default(UNPAID)
  amountPaid    Int      @default(0)
  convenienceFee Int     @default(0)
  createdAt     DateTime @default(now())
}

model Match {
  id            String   @id @default(cuid())
  tournamentId  String
  tournament    Tournament @relation(fields: [tournamentId], references: [id])
  round         Int                   // 1 = babak awal
  position      Int                   // urutan dalam round
  teamAId       String?               // Registration.id
  teamBId       String?
  scoreA        Int?
  scoreB        Int?
  winnerId      String?
  nextMatchId   String?               // match tujuan pemenang
  nextSlot      String?               // "A" | "B"
  status        MatchStatus @default(PENDING)
  isBye         Boolean  @default(false)

  @@index([tournamentId, round])
}

model SponsorProposal {
  id            String   @id @default(cuid())
  tournamentId  String
  tournament    Tournament @relation(fields: [tournamentId], references: [id])
  title         String
  pitchText     String               // hasil Auto-Proposal Generator
  targetAmount  Int
  expectedReach Int                  // estimasi penonton
  benefits      String               // JSON array: logo, banner, shoutout
  status        ProposalStatus @default(OPEN)
  deals         SponsorDeal[]
  createdAt     DateTime @default(now())
}

model SponsorDeal {
  id            String   @id @default(cuid())
  proposalId    String
  proposal      SponsorProposal @relation(fields: [proposalId], references: [id])
  sponsorId     String
  sponsor       User     @relation(fields: [sponsorId], references: [id])
  amount        Int
  platformFee   Int                  // 10% dari amount (dihitung di fees.ts)
  netToOrganizer Int
  status        DealStatus @default(PENDING)
  createdAt     DateTime @default(now())
}

model LfgPost {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  game          String
  role          String               // "Tank", "Support", "Duelist"…
  rank          String               // "Epic", "Immortal"…
  playStyle     String               // "Kompetitif", "Santai"
  availability  String               // "Malam hari, Sabtu-Minggu"
  bio           String
  tournamentId  String?              // opsional: ngincer turnamen tertentu
  status        LfgStatus @default(OPEN)
  invites       LfgInvite[]
  createdAt     DateTime @default(now())
}

model LfgInvite {
  id        String @id @default(cuid())
  postId    String
  post      LfgPost @relation(fields: [postId], references: [id])
  fromUserId String
  message   String
  accepted  Boolean @default(false)
}

model AdSlot {
  id           String   @id @default(cuid())
  tournamentId String
  tournament   Tournament @relation(fields: [tournamentId], references: [id])
  placement    AdSlotPlacement
  price        Int                   // harga terjangkau untuk UMKM
  bookings     AdBooking[]
}

model AdBooking {
  id         String @id @default(cuid())
  slotId     String
  slot       AdSlot @relation(fields: [slotId], references: [id])
  sponsorId  String
  sponsor    User   @relation(fields: [sponsorId], references: [id])
  brandName  String
  bannerText String
  bannerColor String @default("#f59e0b")
}

model HelpTicket {
  id        String @id @default(cuid())
  userId    String
  user      User   @relation(fields: [userId], references: [id])
  subject   String
  message   String
  status    String @default("OPEN")
  createdAt DateTime @default(now())
}
```

---

## 7. Logika Inti (spesifikasi untuk `src/lib/`)

### 7.1 `bracket.ts` — Single Elimination dengan BYE ★ (WAJIB BENAR)

**Input:** array `Registration` (sudah di-seed/urut), `tournamentId`.
**Output:** array `Match` lengkap dengan `nextMatchId` & `nextSlot`.

Algoritma:
1. `n` = jumlah tim. `size` = pangkat 2 terkecil ≥ `n` (misal n=11 → size=16).
2. `byes = size - n`. Tim seed teratas mendapat BYE (langsung lolos).
3. Total round = `log2(size)`. Round 1 punya `size/2` match.
4. Buat match dari round terakhir (final) ke round 1 agar `nextMatchId` mudah diisi, ATAU buat round 1 dulu lalu hitung `nextMatchId = round(r+1).position = floor(pos/2)`, `nextSlot = pos % 2 === 0 ? "A" : "B"`.
5. Penempatan seed standar (1 vs terakhir, dst) — pakai urutan seed bracket standar:
   `seedOrder(size)` rekursif: `[1,2]` → `[1,4,2,3]` → `[1,8,4,5,2,7,3,6]` dst.
6. Match yang salah satu sisinya BYE → `isBye=true`, `status=DONE`, pemenang otomatis tim yang ada, dan **langsung dimasukkan ke slot `nextMatch`**.
7. Shuffle opsional: tombol "Acak Seed" vs "Urut Pendaftaran".

```ts
// signature
export function seedOrder(size: number): number[]
export function generateBracket(teamIds: string[]): BracketMatchDraft[]
export function advanceWinner(matches: Match[], matchId: string, scoreA: number, scoreB: number): Match[]
// advanceWinner: tentukan winner, tulis ke nextMatch[nextSlot],
// jika nextMatch kedua slot terisi → status READY.
// Tolak skor seri (scoreA === scoreB).
// Jika match final selesai → Tournament.status = FINISHED.
```

**Edge case yang harus dites (`tests/bracket.test.ts`):**
n = 2, 3, 4, 5, 8, 11, 16, 17 · semua BYE ter-advance benar · final tidak punya `nextMatchId` · tidak ada tim muncul dua kali di round 1.

### 7.2 `fees.ts`

Konstanta di `constants.ts` (mudah diubah, tandai sebagai **asumsi**):

```ts
export const FEES = {
  SAAS_BASE: 150_000,          // per event (asumsi)
  SAAS_PER_TEAM_OVER_16: 5_000,// tambahan jika maxTeams > 16 (asumsi)
  SUCCESS_RATE: 0.10,          // 10% — dari BMC
  CONVENIENCE_FLAT: 2_500,     // biaya admin solo player (asumsi)
  LOYALTY_THRESHOLD: 3,        // event ≥ 3 → diskon
  LOYALTY_DISCOUNT: 0.10,      // 10% off SaaS fee (asumsi)
}
```

```ts
export function calcSaasFee(maxTeams: number, eventsHeldBefore: number): { gross: number; discount: number; net: number }
export function calcSponsorDeal(amount: number): { platformFee: number; netToOrganizer: number }  // 10%
export function calcTicket(entryFee: number, isSolo: boolean): { entryFee: number; convenienceFee: number; total: number }
```
Convenience Fee **hanya** untuk `isSolo = true` (sesuai BMC).

### 7.3 `proposal.ts` — Auto-Proposal Generator (tanpa AI)

Input form organizer: nama acara, game, tanggal, estimasi peserta, estimasi penonton, target dana, paket benefit (checklist).
Output: teks proposal terstruktur (Markdown) dengan seksi: **Latar Belakang → Profil Acara → Statistik Target → Paket Sponsor & Benefit → Estimasi ROI sederhana (biaya per penonton) → Penutup/Kontak**.
Tampilkan preview + tombol "Simpan sebagai proposal di Sponsor Directory" + tombol "Cetak/PDF" (`window.print()` dengan CSS print).

### 7.4 `lfg.ts`
- Filter: `game`, `role`, `rank`, `playStyle`, `status=OPEN`.
- Skor kecocokan sederhana (opsional, nilai tambah): +2 game sama, +1 playStyle sama, +1 role melengkapi. Hanya untuk urutan tampilan.
- "Ajak Gabung" → buat `LfgInvite`. "Terima" → kedua pihak bisa lihat kontak mock, status post → `TEAM_FORMED`.

### 7.5 `MockPayment`
Fungsi `mockPay(amount): Promise<{ok: true, ref: string}>` — `setTimeout` 1,2 detik, selalu sukses, ref acak `MOCK-XXXXXX`. UI harus jelas bertuliskan **"Mode Demo — tidak ada uang sungguhan"**.

---

## 8. Peta Halaman & Alur Pengguna

### Alur A — Organizer (alur demo utama)
```
Landing → pilih "Masuk sebagai Panitia"
→ Dashboard → "Buat Turnamen" (form: nama, game, jumlah tim, biaya daftar, tanggal, link stream)
→ Lihat estimasi SaaS Fee → Publish (mock bayar SaaS fee)
→ Peserta mendaftar (dari seed/Alur C) → halaman Manage
→ klik "Generate Bracket" → BracketView muncul
→ input skor → pemenang maju otomatis → Final → status FINISHED
→ Tab "Sponsorship": isi form → Auto-Proposal → simpan ke Directory
→ Tab "Billing": rincian SaaS fee + success fee dari deal
```

### Alur B — Sponsor (UMKM)
```
Masuk sebagai Sponsor → Directory → filter (game / kisaran dana / tanggal)
→ Detail proposal (reach, benefit) → "Danai Acara" (input nominal)
→ FeeBreakdown: nominal, fee platform 10%, diterima panitia → Konfirmasi (mock bayar)
→ Halaman Ads: pilih slot iklan (pre-roll/side/break) → isi nama brand + teks banner
→ Lihat preview banner di StreamEmbed
```

### Alur C — Player
```
Masuk sebagai Player → Daftar turnamen → Detail → "Daftar"
  ├─ Daftar sebagai tim: isi nama tim + anggota
  └─ Daftar sebagai solo player → diarahkan ke LFG ATAU langsung daftar sebagai solo
→ Checkout: harga tiket + Convenience Fee (hanya solo) → mock bayar → status PAID
→ LFG: buat post → filter post orang lain → "Ajak Gabung" → terima → tim terbentuk
→ Nonton: halaman turnamen → StreamEmbed + AdSlotBanner dari sponsor
```

### Halaman publik tambahan
- **Landing**: hero, 3 masalah → 3 solusi, cara kerja (3 langkah), fitur (Auto-Bracket, Sponsor Hub, LFG, Stream), tabel harga (SaaS/Success/Convenience), CTA "Coba Demo".
- **Helpdesk**: form tiket + daftar tiket milik user.

---

## 9. Komponen UI Kunci

| Komponen | Perilaku |
|---|---|
| `RoleSwitcher` | Dropdown di navbar: Panitia / Sponsor / Player (+ nama user dummy). Set cookie & redirect. |
| `BracketView` | Kolom per round, `MatchCard` bertumpuk, garis penghubung (SVG/CSS). Scroll horizontal di mobile. Match BYE tampil redup berlabel "BYE". Klik match (organizer) → `ScoreDialog`. |
| `MatchCard` | Nama tim A/B, skor, highlight pemenang, status badge. |
| `FeeBreakdown` | Tabel rincian biaya + baris total; dipakai di SaaS fee, deal sponsor, checkout. |
| `ProposalCard` | Judul, acara, target dana vs terkumpul (progress bar), reach, tombol detail. |
| `LfgCard` | Avatar inisial, game, role, rank, playStyle, jam main, tombol "Ajak Gabung". |
| `StreamEmbed` | `<iframe>` dari `streamUrl` (rasio 16:9) + sisi kanan `AdSlotBanner`. Jika tidak ada URL → placeholder "Stream belum dimulai". |
| `AdSlotBanner` | Rotasi banner (setiap 5 dtk) dari `AdBooking` pada turnamen tsb; fallback "Slot tersedia — Rp X". |
| `DemoBanner` | Pita kecil "MODE DEMO" di atas halaman agar jelas ini mock-up. |

Gaya visual: **dark mode gaming** (latar gelap, aksen ungu/oranye-biru sesuai tema PDF), kartu rounded, font sans modern. Mobile-first responsive.

---

## 10. Data Seed (wajib agar demo terlihat hidup)

`prisma/seed.ts` membuat:
- **3 organizer**: "BEM FSM Undip", "Himpunan Informatika", "Semarang Esports Community".
- **5 sponsor UMKM**: kafe, barbershop, toko komputer, laundry kos, warung makan (nama fiktif lokal).
- **12 player** dengan nama Indonesia.
- **4 turnamen**: 1 `DRAFT`, 1 `OPEN` (6 tim terdaftar → ganjil, bagus untuk demo BYE), 1 `ONGOING` (bracket 8 tim, sebagian skor terisi), 1 `FINISHED`.
- **6 proposal sponsor** dengan target dana bervariasi (Rp 500 rb – Rp 5 jt), sebagian sudah sebagian terdanai.
- **10 LFG post** lintas game (Mobile Legends, Valorant, Free Fire, PUBG Mobile, EA FC).
- **AdSlot** (3 per turnamen) + beberapa `AdBooking`.
- `streamUrl`: pakai satu video YouTube embed publik (placeholder, mudah diganti).
- Script `npm run db:reset` = migrate reset + seed.

---

## 11. Rencana Build Bertahap (jalankan per fase di opencode)

### Fase 0 — Scaffolding (±15 mnt)
- Init Next.js + TS + Tailwind + shadcn/ui, install Prisma, Zod, lucide.
- Buat struktur folder (Bagian 5), `schema.prisma`, `seed.ts`, `db.ts`, `session.ts`, `RoleSwitcher`, `Navbar`, `DemoBanner`.
- **DoD:** `npm run dev` jalan, `npm run db:reset` mengisi data, role switcher mengganti role.

### Fase 1 — Landing + Daftar Turnamen
- Landing page lengkap, `/tournaments`, `/tournaments/[id]` (info saja dulu).
- **DoD:** landing rapi di mobile & desktop, daftar turnamen dari DB tampil.

### Fase 2 — ★ Auto-Bracket (inti #1)
- Implement `bracket.ts` + `tests/bracket.test.ts` (**lulus dulu sebelum UI**).
- Halaman `organizer/tournaments/[id]/manage`: tabel peserta, tombol Generate Bracket, `BracketView`, `ScoreDialog`.
- **DoD:** n=5, 8, 11 menghasilkan bracket benar; input skor memajukan pemenang; final → status FINISHED.

### Fase 3 — Registrasi & Checkout (mock)
- `RegisterForm`, halaman checkout, `fees.ts` + tes, `MockPayment`.
- **DoD:** solo player melihat Convenience Fee, tim biasa tidak; setelah "bayar" status → PAID.

### Fase 4 — ★ Sponsor Directory + Proposal (inti #2)
- `sponsors/directory` + filter, detail proposal, `DealDialog` + `FeeBreakdown` (10%).
- Halaman organizer/sponsorship + `proposal.ts` (Auto-Proposal Generator) + print.
- **DoD:** deal Rp 1.000.000 → fee Rp 100.000, netto Rp 900.000; progress bar proposal bertambah.

### Fase 5 — ★ LFG (inti #3)
- `/lfg`, form post, filter, ajak gabung, terima → status `TEAM_FORMED`.
- **DoD:** alur ajak → terima jalan antar-role Player.

### Fase 6 — Stream + Slot Iklan
- `StreamEmbed`, `AdSlotBanner`, halaman `sponsor/ads`.
- **DoD:** booking slot oleh sponsor langsung muncul di halaman stream turnamen.

### Fase 7 — Dashboard & Billing
- 3 dashboard ringkas (kartu statistik + daftar), `organizer/billing` (SaaS fee + success fee + diskon loyalitas).
- **DoD:** angka dashboard berasal dari DB, bukan hardcode.

### Fase 8 — Polish & Helpdesk
- Helpdesk, empty state, loading state, responsif, README (daftar yang di-mock), skrip demo.
- **DoD:** seluruh Alur A/B/C (Bagian 8) bisa dijalankan tanpa error.

> **Jika waktu mepet:** kerjakan **Fase 0 → 1 → 2 → 4 → 5** saja. Itu sudah mencakup tiga pilar value proposition (Performance, Newness, Newness). Fase 3, 6, 7, 8 boleh sebagian di-mock statis.

---

## 12. Template Prompt untuk opencode

**Prompt pembuka (sekali saja):**
```
Baca SPEC.md di root repo. Kita akan membangun mock-up website ARENA secara bertahap.
Patuhi legenda REAL/MOCK/SKIP di Bagian 2, tech stack di Bagian 3, dan struktur folder di Bagian 5.
Jangan lanjut ke fase berikutnya sebelum aku bilang. Mulai dari Fase 0.
```

**Prompt per fase (contoh Fase 2):**
```
Kerjakan Fase 2 dari SPEC.md (Auto-Bracket).
Urutan: (1) tulis src/lib/bracket.ts sesuai Bagian 7.1, (2) tulis tests/bracket.test.ts
dengan semua edge case yang disebut, jalankan sampai lulus, (3) baru bangun UI
BracketView, MatchCard, ScoreDialog dan halaman manage.
Setelah selesai, tunjukkan ringkasan file yang diubah dan cara mengetes manual.
```

**Prompt perbaikan (kalau ada bug):**
```
Bug: [jelaskan]. Reproduksi: [langkah]. Perbaiki seminimal mungkin, jangan refactor file lain,
tambahkan tes regresi jika menyangkut src/lib/.
```

---

## 13. Skenario Demo (untuk presentasi kelompok)

1. **(1 mnt)** Landing → jelaskan 3 masalah & 3 solusi.
2. **(3 mnt)** Panitia: buka turnamen `OPEN` dengan 6 tim → Generate Bracket (tunjukkan BYE otomatis) → input 2 skor → pemenang maju.
3. **(2 mnt)** Panitia: Auto-Proposal Generator → simpan ke Directory.
4. **(2 mnt)** Ganti ke Sponsor (UMKM): danai Rp 1.000.000 → tunjukkan fee 10% → booking slot iklan.
5. **(1 mnt)** Ganti ke Player: LFG → ajak gabung → tim terbentuk.
6. **(1 mnt)** Halaman stream: banner UMKM muncul. Buka Billing: tunjukkan tiga sumber pendapatan.

---

## 14. Asumsi & Catatan (harap diverifikasi kelompok)

- Tarif `SAAS_BASE`, `CONVENIENCE_FLAT`, diskon loyalitas **bukan dari PDF** — hanya placeholder. Success fee **10%** diambil langsung dari BMC.
- PDF menyebut istilah "Sponsor Hub" dan "Sponsor Directory" bergantian; di mock-up dipakai **Sponsor Directory** sebagai nama halaman, "Sponsor Hub" sebagai nama menu.
- PDF menyebut "Auto-Proposal Generator" hanya di Key Resources — di sini dijadikan fitur MOCK berbasis template.
- Format turnamen dibatasi **single elimination**; format lain dicatat sebagai pengembangan lanjutan.
- Ini mock-up edukasi: tidak memproses uang, tidak menyimpan data sensitif.

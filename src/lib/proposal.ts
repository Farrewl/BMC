export type ProposalInput = {
  eventName: string;
  game: string;
  date: string;
  participants: number;
  viewers: number;
  target: number;
  benefits: string[];
  contact: string;
};

export function buildProposal(p: ProposalInput): string {
  const perViewer = p.viewers > 0 ? Math.round(p.target / p.viewers) : p.target;
  return `# ${p.eventName} — Proposal Sponsor

## 1. Latar Belakang
${p.eventName} adalah turnamen ${p.game} skala kampus/komunitas yang mempertemukan ${p.participants} peserta dan ditonton ${p.viewers} penonton. Kami membuka kemitraan dengan UMKM lokal untuk tumbuh bersama.

## 2. Profil Acara
- Game: ${p.game}
- Tanggal: ${p.date}
- Peserta: ${p.participants} tim/pemain
- Estimasi penonton: ${p.viewers} (offline + stream)

## 3. Paket Sponsor & Benefit
${p.benefits.map((b) => `- ${b}`).join("\n")}

## 4. Estimasi ROI Sederhana
- Target dana: Rp ${p.target.toLocaleString("id-ID")}
- Biaya per penonton: Rp ${perViewer.toLocaleString("id-ID")}
- Eksposur: logo jersey, shoutout MC, banner stream selama acara.

## 5. Penutup & Kontak
Hubungi panitia: ${p.contact}. Dana difasilitasi LombaEsport (fee platform 10%, transparan di kwitansi).

_Mode demo — angka di atas simulasi, bukan penawaran resmi._
`;
}

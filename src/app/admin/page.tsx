import { Navbar, Footer } from "@/components/layout/Navbar";
import { BrutaCard, BrutaBadge } from "@/components/ui/bruta";
import { db } from "@/lib/db";
import { rupiah, tanggal } from "@/lib/format";
import {
  approveUserAction,
  rejectUserAction,
  requireRole,
  type Role,
} from "@/lib/session";

const roleColor: Record<string, string> = {
  ADMIN: "#FF2E2E",
  ORGANIZER: "#8B5CF6",
  SPONSOR: "#FF6B1A",
  PLAYER: "#22D3EE",
};

const roleLabel: Record<string, string> = {
  ADMIN: "Admin",
  ORGANIZER: "Panitia",
  SPONSOR: "Sponsor",
  PLAYER: "Player",
};

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <BrutaCard className="p-4">
      <div className="h-2 w-10 rounded-full border-2 border-black" style={{ background: color }} />
      <p className="mt-2 font-display text-2xl font-black text-cream">{value}</p>
      <p className="font-body text-[11px] uppercase tracking-wide text-mutedcream">
        {label}
      </p>
    </BrutaCard>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireRole("ADMIN");
  const { error } = await searchParams;

  const [byRole, pending, rejectedCount, userCount, tournamentCount, regCount, proposalCount, lfgCount, paidAgg] =
    await Promise.all([
      db.user.groupBy({ by: ["role"], _count: { id: true } }),
      db.user.findMany({
        where: { approved: false },
        orderBy: { createdAt: "asc" },
      }),
      db.rejectedUser.count(),
      db.user.count(),
      db.tournament.count(),
      db.registration.count(),
      db.sponsorProposal.count(),
      db.lfgPost.count(),
      db.sponsorDeal.aggregate({
        where: { status: "PAID" as const },
        _sum: { amount: true },
      }),
    ]);

  const paid = paidAgg?._sum?.amount ?? 0;
  const roleCount = (r: Role) =>
    byRole.find((x) => x.role === r)?._count.id ?? 0;

  const allUsers = await db.user.findMany({ orderBy: { createdAt: "desc" } });
  const rejected = await db.rejectedUser.findMany({
    orderBy: { rejectedAt: "desc" },
  });

  return (
    <div className="flex min-h-full flex-1 flex-col bg-void text-cream">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <BrutaBadge color="#FF2E2E">Admin · Pemantau</BrutaBadge>
        <h1 className="mt-3 font-display text-3xl font-black">DASHBOARD ADMIN</h1>

        {/* STATISTIK */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <Stat label="Panitia" value={roleCount("ORGANIZER")} color="#8B5CF6" />
          <Stat label="Sponsor" value={roleCount("SPONSOR")} color="#FF6B1A" />
          <Stat label="Player" value={roleCount("PLAYER")} color="#22D3EE" />
          <Stat label="Menunggu Verifikasi" value={pending.length} color="#F59E0B" />
          <Stat label="Total Akun" value={userCount} color="#FFD02B" />
          <Stat label="Akun Ditolak" value={rejectedCount} color="#EF4444" />
          <Stat label="Turnamen" value={tournamentCount} color="#B5E048" />
          <Stat label="Registrasi Tim" value={regCount} color="#8B5CF6" />
          <Stat label="Proposal Sponsor" value={proposalCount} color="#FF6B1A" />
          <Stat label="Posting LFG" value={lfgCount} color="#22D3EE" />
          <Stat
            label="Dana Deal PAID"
            value={rupiah(paid ?? 0)}
            color="#22C55E"
          />
        </div>

        {error === "alasan" ? (
          <p className="mt-6 rounded-xl border-[3px] border-black bg-lose px-3 py-2 font-body text-sm font-bold text-white shadow-bruta-sm">
            Alasan penolakan minimal 3 huruf.
          </p>
        ) : null}

        {/* PENGAJUAN MENUNGGU */}
        <div className="mt-8">
          <h2 className="font-display text-xl font-black">
            PENGAJUAN MENUNGGU VERIFIKASI
          </h2>
          {pending.length === 0 ? (
            <BrutaCard className="mt-3 p-5 font-body text-sm text-mutedcream">
              Tidak ada pengajuan yang menunggu.
            </BrutaCard>
          ) : (
            <div className="mt-3 space-y-3">
              {pending.map((u) => (
                <BrutaCard key={u.id} className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <BrutaBadge color={roleColor[u.role]}>{roleLabel[u.role]}</BrutaBadge>
                        <span className="font-body text-xs text-mutedcream">
                          {tanggal(u.createdAt)}
                        </span>
                      </div>
                      <p className="mt-2 font-display text-base font-black text-cream">
                        {u.name}
                      </p>
                      <p className="font-body text-xs text-mutedcream">{u.email}</p>
                      {u.orgName ? (
                        <p className="font-body text-xs text-mutedcream">
                          Organisasi: {u.orgName}
                          {u.city ? ` · ${u.city}` : ""}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <form action={approveUserAction.bind(null, u.id)}>
                        <button
                          type="submit"
                          className="bruta-press w-full cursor-pointer rounded-xl border-[3px] border-black bg-poplime px-4 py-2 font-display text-xs font-bold uppercase text-black shadow-bruta-sm sm:w-auto"
                        >
                          Setujui
                        </button>
                      </form>
                      <form
                        action={rejectUserAction}
                        className="flex items-center gap-2"
                      >
                        <input type="hidden" name="userId" value={u.id} />
                        <input
                          name="reason"
                          required
                          minLength={3}
                          placeholder="Alasan tolak"
                          className="rounded-xl border-[3px] border-black bg-white px-3 py-2 font-body text-xs font-medium text-black"
                        />
                        <button
                          type="submit"
                          className="bruta-press cursor-pointer rounded-xl border-[3px] border-black bg-lose px-4 py-2 font-display text-xs font-bold uppercase text-white shadow-bruta-sm"
                        >
                          Tolak
                        </button>
                      </form>
                    </div>
                  </div>
                </BrutaCard>
              ))}
            </div>
          )}
        </div>

        {/* DAFTAR USER */}
        <div className="mt-8">
          <h2 className="font-display text-xl font-black">SEMUA AKUN</h2>
          <BrutaCard className="mt-3 overflow-x-auto p-0">
            <table className="w-full min-w-[640px] border-collapse font-body text-sm">
              <thead>
                <tr className="border-b-[3px] border-black bg-elevated font-display text-[11px] uppercase tracking-wide text-cream">
                  <th className="px-4 py-3 text-left">Nama</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Organisasi</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((u) => (
                  <tr key={u.id} className="border-b-2 border-black/20 text-cream">
                    <td className="px-4 py-3 font-bold">{u.name}</td>
                    <td className="px-4 py-3 text-mutedcream">{u.email}</td>
                    <td className="px-4 py-3">
                      <BrutaBadge color={roleColor[u.role]}>{roleLabel[u.role]}</BrutaBadge>
                    </td>
                    <td className="px-4 py-3 text-mutedcream">{u.orgName ?? "—"}</td>
                    <td className="px-4 py-3">
                      {u.approved ? (
                        <span className="font-display text-[11px] font-bold uppercase text-win">
                          Aktif
                        </span>
                      ) : (
                        <span className="font-display text-[11px] font-bold uppercase text-pending">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </BrutaCard>
        </div>

        {/* ARSIP DITOLAK */}
        <div className="mt-8">
          <h2 className="font-display text-xl font-black">ARSIP PENOLAKAN</h2>
          {rejected.length === 0 ? (
            <BrutaCard className="mt-3 p-5 font-body text-sm text-mutedcream">
              Belum ada penolakan.
            </BrutaCard>
          ) : (
            <BrutaCard className="mt-3 overflow-x-auto p-0">
              <table className="w-full min-w-[720px] border-collapse font-body text-sm">
                <thead>
                  <tr className="border-b-[3px] border-black bg-elevated font-display text-[11px] uppercase tracking-wide text-cream">
                    <th className="px-4 py-3 text-left">Nama</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Alasan</th>
                    <th className="px-4 py-3 text-left">Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {rejected.map((r) => (
                    <tr key={r.id} className="border-b-2 border-black/20 text-cream">
                      <td className="px-4 py-3 font-bold">{r.name}</td>
                      <td className="px-4 py-3 text-mutedcream">{r.email}</td>
                      <td className="px-4 py-3">
                        <BrutaBadge color={roleColor[r.role]}>{roleLabel[r.role]}</BrutaBadge>
                      </td>
                      <td className="px-4 py-3 text-mutedcream">{r.reason}</td>
                      <td className="px-4 py-3 text-mutedcream">
                        {tanggal(r.rejectedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </BrutaCard>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

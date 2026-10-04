import { DemoBanner } from "@/components/layout/DemoBanner";
import { Navbar, Footer } from "@/components/layout/Navbar";
import { BrutaCard, BrutaBadge, BrutaLink } from "@/components/ui/bruta";
import { db } from "@/lib/db";
import { demoLfgPosts, withDemo } from "@/lib/demo";
import { gameColor } from "@/lib/data";
import { lfgInviteAction } from "@/lib/actions";

const AVATAR_BG = ["#8B5CF6", "#EF4444", "#FF6B1A", "#FFD02B", "#22C55E", "#22D3EE", "#FF4D8D"];

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default async function LfgPage() {
  const posts = await withDemo(
    () =>
      db.lfgPost.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } }, _count: { select: { invites: true } } },
        take: 12,
      }),
    demoLfgPosts
  );

  return (
    <div className="flex min-h-full flex-1 flex-col bg-void text-cream">
      <DemoBanner />
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <BrutaBadge color="#22D3EE">Papan LFG</BrutaBadge>
        <h1 className="mt-3 font-display text-3xl font-black">PAPAN LFG</h1>
        <p className="mt-2 max-w-2xl font-body text-sm text-mutedcream">
          Solo player cari tim: game, role, rank, gaya main. Klik Ajak Gabung untuk buka dashboard player.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <BrutaCard key={p.id} className="p-5">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-xl border-[3px] border-black font-display text-lg font-black text-black"
                  style={{ background: AVATAR_BG[i % AVATAR_BG.length] }}
                >
                  {initials(p.user.name)}
                </span>
                <div>
                  <p className="font-display text-sm font-black text-cream">LFG · {p.game}</p>
                  <p className="font-body text-xs text-mutedcream">{p.user.name} · {p.rank}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <BrutaBadge color={gameColor(p.game)}>{p.role}</BrutaBadge>
                <BrutaBadge color="#F8F4E8">{p.playStyle}</BrutaBadge>
              </div>
              <p className="mt-3 font-body text-sm text-cream">{p.bio}</p>
              <p className="mt-1 font-body text-xs text-mutedcream">
                Main: {p.availability} · {p.status === "TEAM_FORMED" ? "Tim Terbentuk ✓" : `${p._count.invites} undangan`}
              </p>
              {p.status === "OPEN" ? (
                <form action={lfgInviteAction} className="mt-3 flex gap-2">
                  <input type="hidden" name="postId" value={p.id} />
                  <input name="message" required minLength={4} placeholder="Gas push rank bareng…" className="min-w-0 flex-1 rounded-lg border-2 border-black bg-white px-2 py-2 font-body text-xs font-bold text-black" />
                  <button type="submit" className="cursor-pointer rounded-lg border-2 border-black bg-popcyan px-3 py-2 font-display text-[11px] font-black text-black">AJAK</button>
                </form>
              ) : (
                <p className="mt-3 inline-block rounded-md border-2 border-black bg-poplime px-2 font-display text-[11px] font-black text-black">TIM TERBENTUK ✓</p>
              )}
              <BrutaLink href="/player" variant="dark" className="mt-2 w-full !py-2 !text-xs">
                Dashboard Player →
              </BrutaLink>
            </BrutaCard>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

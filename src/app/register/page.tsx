import Link from "next/link";
import { redirect } from "next/navigation";
import { Navbar, Footer } from "@/components/layout/Navbar";
import { BrutaCard } from "@/components/ui/bruta";
import { HOME_BY_ROLE, getSession, registerAccountAction } from "@/lib/session";

const input =
  "w-full rounded-xl border-[3px] border-black bg-white px-3 py-2 font-body text-sm font-medium text-black";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string; reason?: string }>;
}) {
  const session = await getSession();
  const { error, success, reason } = await searchParams;

  if (session) {
    redirect(HOME_BY_ROLE[session.role]);
  }

  const errorText: Record<string, string> = {
    nama: "Nama minimal 3 huruf.",
    email: "Format email tidak valid.",
    role: "Role tidak valid.",
    org: "Nama organisasi minimal 3 huruf.",
    exists: "Email sudah terdaftar. Silakan masuk.",
    pending: "Akun ini sedang menunggu verifikasi admin.",
    rejected: `Pengajuan sebelumnya ditolak${reason ? `: ${reason}` : "."}`,
  };

  return (
    <div className="flex min-h-full flex-1 flex-col bg-void text-cream">
      <Navbar />
      <main className="flex-1">
        <section className="halftone-dark grid-line-dark">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h1 className="mt-4 font-display text-3xl font-black leading-tight sm:text-4xl">
              DAFTAR JADI <span className="text-sun">BAGIAN</span> NGE-SPORT
            </h1>

            {success === "pending" ? (
              <div className="mt-6 rounded-2xl border-[3px] border-black bg-card p-5 shadow-bruta">
                <p className="font-display text-lg font-black text-sun">
                  PENGAJUAN TERKIRIM
                </p>
                <p className="mt-2 font-body text-sm text-mutedcream">
                  Pengajuan akun panitia/sponsor kamu sedang menunggu verifikasi
                  admin. Coba masuk lagi setelah disetujui.
                </p>
                <Link
                  href="/login"
                  className="bruta-press mt-4 inline-block rounded-xl border-[3px] border-black bg-arena px-5 py-2 font-display text-xs font-bold uppercase text-white shadow-bruta"
                >
                  Ke Halaman Masuk
                </Link>
              </div>
            ) : (
              <BrutaCard className="mt-6 p-5">
                {error && errorText[error] ? (
                  <p className="mb-4 rounded-xl border-[3px] border-black bg-lose px-3 py-2 font-body text-sm font-bold text-white shadow-bruta-sm">
                    {errorText[error]}
                  </p>
                ) : null}
                <form action={registerAccountAction} className="space-y-3">
                  <div>
                    <label className="font-display text-[11px] font-bold">NAMA</label>
                    <input
                      name="name"
                      type="text"
                      required
                      minLength={3}
                      placeholder="Nama lengkap kamu"
                      className={input}
                    />
                  </div>
                  <div>
                    <label className="font-display text-[11px] font-bold">EMAIL</label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="nama@email.id"
                      className={input}
                    />
                  </div>
                  <div>
                    <label className="font-display text-[11px] font-bold">DAFTAR SEBAGAI</label>
                    <div className="mt-1 grid gap-2 sm:grid-cols-3">
                      {(
                        [
                          { value: "PLAYER", label: "Player" },
                          { value: "ORGANIZER", label: "Panitia" },
                          { value: "SPONSOR", label: "Sponsor" },
                        ] as const
                      ).map((r) => (
                        <label
                          key={r.value}
                          className="cursor-pointer rounded-xl border-[3px] border-black bg-elevated px-3 py-2 text-center font-display text-xs font-bold uppercase text-cream has-checked:bg-card has-checked:shadow-bruta-sm"
                        >
                          <input
                            type="radio"
                            name="role"
                            value={r.value}
                            defaultChecked={r.value === "PLAYER"}
                            className="sr-only"
                          />
                          {r.label}
                        </label>
                      ))}
                    </div>
                    <p className="mt-1 font-body text-xs text-mutedcream">
                      Panitia & sponsor perlu verifikasi admin sebelum bisa masuk.
                    </p>
                  </div>
                  <div>
                    <label className="font-display text-[11px] font-bold">
                      NAMA ORGANISASI <span className="text-mutedcream">(panitia/sponsor)</span>
                    </label>
                    <input
                      name="orgName"
                      type="text"
                      placeholder="cth: BEM FSM, Kopi Kos Ndalem"
                      className={input}
                    />
                  </div>
                  <div>
                    <label className="font-display text-[11px] font-bold">
                      KOTA <span className="text-mutedcream">(opsional)</span>
                    </label>
                    <input
                      name="city"
                      type="text"
                      placeholder="cth: Semarang"
                      className={input}
                    />
                  </div>
                  <button
                    type="submit"
                    className="bruta-press w-full cursor-pointer rounded-xl border-[3px] border-black bg-arena px-5 py-3 font-display text-sm font-bold uppercase tracking-wide text-white shadow-bruta"
                  >
                    Daftar →
                  </button>
                </form>
              </BrutaCard>
            )}

            <p className="mt-5 font-body text-sm text-mutedcream">
              Sudah punya akun?{" "}
              <Link href="/login" className="font-bold text-sun underline">
                Masuk
              </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

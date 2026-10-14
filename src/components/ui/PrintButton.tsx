"use client";

export function PrintButton({ label = "Cetak / PDF" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="mt-3 w-full cursor-pointer rounded-xl border-[3px] border-black bg-cream px-4 py-2 font-display text-xs font-bold text-black"
    >
      {label} 🖨
    </button>
  );
}

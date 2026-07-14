import Link from "next/link";
import { APP_NAME } from "@/lib/utils/constants";

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div className="space-y-3">
          <p className="font-serif text-2xl font-semibold">{APP_NAME}</p>
          <p className="max-w-lg text-sm text-primary-foreground/75">
            Blog editorial modern untuk rangkuman, opini, dan bacaan mendalam berbahasa Indonesia.
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">Navigasi</p>
          <div className="grid gap-2 text-sm">
            <Link href="/">Beranda</Link>
            <Link href="/tulisan">Semua Tulisan</Link>
            <Link href="/cari">Cari</Link>
          </div>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">Admin</p>
          <div className="grid gap-2 text-sm">
            <Link href="/admin/login">Masuk Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

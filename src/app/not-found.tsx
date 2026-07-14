import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">404</p>
      <h1 className="mt-4 font-serif text-5xl font-semibold text-primary">Halaman tidak ditemukan</h1>
      <p className="mt-4 text-base leading-8 text-muted-foreground">
        Halaman yang Anda cari mungkin sudah dipindahkan, diarsipkan, atau belum pernah dibuat.
      </p>
      <Button asChild variant="accent" className="mt-8">
        <Link href="/">Kembali ke beranda</Link>
      </Button>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { APP_NAME } from "@/lib/utils/constants";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: "/", label: "Beranda" },
  { href: "/tulisan", label: "Semua Tulisan" },
  { href: "/cari", label: "Cari" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-primary/95 text-primary-foreground backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-serif text-2xl font-semibold tracking-tight">
          {APP_NAME}
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-primary-foreground/85 hover:text-primary-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <form action="/cari" className="hidden min-w-[280px] items-center gap-2 md:flex">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input name="q" placeholder="Cari tulisan..." className="border-white/15 bg-white pl-10 text-foreground" />
          </div>
        </form>
        <Button variant="ghost" className="text-primary-foreground md:hidden" onClick={() => setOpen((current) => !current)}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Buka menu</span>
        </Button>
      </div>
      <div className={cn("border-t border-white/10 bg-primary px-4 py-4 md:hidden", open ? "block" : "hidden")}>
        <div className="mx-auto max-w-7xl space-y-4">
          <form action="/cari" className="flex items-center gap-2">
            <Input name="q" placeholder="Cari tulisan..." className="border-white/15 bg-white text-foreground" />
            <Button variant="accent" type="submit">
              Cari
            </Button>
          </form>
          <nav className="grid gap-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl px-4 py-3 text-sm text-primary-foreground/85 hover:bg-white/10 hover:text-primary-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

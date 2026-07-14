import Link from "next/link";
import { BarChart3, FileText, LogOut, MessageSquare, PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/utils/constants";

const links = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/tulisan", label: "Tulisan", icon: FileText },
  { href: "/admin/tulisan/baru", label: "Tambah Tulisan", icon: PenSquare },
  { href: "/admin/komentar", label: "Komentar", icon: MessageSquare },
];

export function AdminSidebar({ displayName }: { displayName: string }) {
  return (
    <aside className="rounded-[32px] bg-primary p-6 text-primary-foreground shadow-soft">
      <div className="space-y-1">
        <p className="font-serif text-2xl font-semibold">{APP_NAME}</p>
        <p className="text-sm text-primary-foreground/70">Halo, {displayName}</p>
      </div>
      <nav className="mt-8 grid gap-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-primary-foreground/78 hover:bg-white/10 hover:text-primary-foreground"
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <form action="/api/admin/logout" method="post" className="mt-8">
        <Button type="submit" variant="outline" className="w-full border-white/20 bg-transparent text-primary-foreground hover:bg-white/10">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </form>
    </aside>
  );
}

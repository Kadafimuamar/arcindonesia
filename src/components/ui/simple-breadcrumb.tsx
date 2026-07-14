import Link from "next/link";
import type { HTMLAttributes, ReactNode } from "react";

export function Breadcrumb({ children }: { children: ReactNode }) {
  return <nav aria-label="Breadcrumb">{children}</nav>;
}

export function BreadcrumbList({ children }: { children: ReactNode }) {
  return <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">{children}</ol>;
}

export function BreadcrumbItem({ children }: { children: ReactNode }) {
  return <li className="inline-flex items-center gap-2">{children}</li>;
}

export function BreadcrumbSeparator() {
  return <li aria-hidden="true">/</li>;
}

export function BreadcrumbLink({ href, children, ...props }: HTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="text-primary hover:underline" {...props}>
      {children}
    </Link>
  );
}

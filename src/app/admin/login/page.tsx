import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { Card, CardContent } from "@/components/ui/card";
import { createSeoMetadata } from "@/lib/utils/metadata";

export const metadata = createSeoMetadata({
  title: "Login Admin",
  path: "/admin/login",
});

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid w-full items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Area admin</p>
          <h1 className="font-serif text-5xl font-semibold text-primary">Kelola editorial</h1>
          <p className="max-w-xl text-base leading-8 text-muted-foreground">
            Masuk menggunakan akun Admin.
          </p>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="mb-6 space-y-2">
              <h2 className="font-serif text-3xl font-semibold text-primary">Login admin</h2>
              <p className="text-sm text-muted-foreground">Tidak ada registrasi publik untuk area admin.</p>
            </div>
            <AdminLoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

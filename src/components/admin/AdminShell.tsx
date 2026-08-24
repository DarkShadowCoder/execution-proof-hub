import { useState, type ReactNode } from "react";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Landmark,
  Users,
  Handshake,
  Wallet,
  Smartphone,
  Percent,
  Boxes,
  Globe2,
  ScrollText,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import type { AdminAccount } from "@/hooks/useAdminSession";
import { Button } from "@/components/ui/button";

const NAV: { group: string; items: { to: string; label: string; icon: typeof Users }[] }[] = [
  {
    group: "Principal",
    items: [
      { to: "/admin", label: "Accueil", icon: LayoutDashboard },
      { to: "/admin/transactions", label: "Transactions", icon: ArrowLeftRight },
      { to: "/admin/settlements", label: "Règlements", icon: Landmark },
      { to: "/admin/users", label: "Utilisateurs", icon: Users },
    ],
  },
  {
    group: "Opérations",
    items: [
      { to: "/admin/partners", label: "Partenaires", icon: Handshake },
      { to: "/admin/wallets", label: "Wallets", icon: Wallet },
      { to: "/admin/momo", label: "Mobile Money", icon: Smartphone },
      { to: "/admin/tariffs", label: "Tarifs", icon: Percent },
      { to: "/admin/batches", label: "Lots journaliers", icon: Boxes },
    ],
  },
  {
    group: "KmerDiaspora",
    items: [{ to: "/admin/kmerdiaspora", label: "Vue d'ensemble", icon: Globe2 }],
  },
  {
    group: "Système",
    items: [
      { to: "/admin/audit", label: "Audit", icon: ScrollText },
      { to: "/admin/settings", label: "Paramètres", icon: Settings },
    ],
  },
];

export function AdminShell({ admin, children }: { admin: AdminAccount; children: ReactNode }) {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.navigate({ to: "/login" });
  };

  const isActive = (to: string) => (to === "/admin" ? pathname === "/admin" : pathname.startsWith(to));

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-xl md:px-6">
        <button
          className="grid size-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
        <Link to="/admin" className="flex items-center gap-2.5">
          <span className="brand-gradient font-display grid size-8 place-items-center rounded-lg text-base font-bold text-primary-foreground shadow-[var(--shadow-brand)]">
            Z
          </span>
          <span className="font-display hidden text-base font-semibold tracking-tight sm:block">
            Zender<span className="text-primary">237</span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <button
            className="relative grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="size-4" />
          </button>
          <div className="flex items-center gap-2 rounded-full border border-border py-1 pr-3 pl-1">
            <span className="grid size-7 place-items-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
              {admin.full_name?.slice(0, 2).toUpperCase()}
            </span>
            <div className="hidden leading-tight sm:block">
              <p className="text-xs font-semibold">{admin.full_name}</p>
              <p className="text-[10px] text-muted-foreground capitalize">{admin.role}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={signOut} className="gap-1.5">
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Quitter</span>
          </Button>
        </div>
      </header>

      <div className="flex">
        {open ? (
          <button
            aria-label="Fermer le menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-14 z-20 bg-foreground/30 backdrop-blur-[2px] lg:hidden"
          />
        ) : null}
        <aside
          className={cn(
            "fixed inset-y-14 left-0 z-30 w-64 shrink-0 overflow-y-auto border-r border-sidebar-border bg-sidebar px-3 py-5 transition-transform duration-200 lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {NAV.map((section) => (
            <div key={section.group} className="mb-7">
              <p className="px-3 pb-2 text-[10px] font-semibold tracking-[0.12em] text-sidebar-foreground/45 uppercase">
                {section.group}
              </p>
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const active = isActive(item.to);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-r-full transition-opacity",
                          active ? "bg-sidebar-primary opacity-100" : "opacity-0",
                        )}
                        aria-hidden
                      />
                      <item.icon
                        className={cn(
                          "size-4 shrink-0 transition-colors",
                          active ? "text-sidebar-primary" : "text-sidebar-foreground/55",
                        )}
                      />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1400px] space-y-6 px-4 py-6 md:px-8 md:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

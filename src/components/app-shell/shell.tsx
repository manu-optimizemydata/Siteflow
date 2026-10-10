"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
  Bell,
  Buildings,
  CalendarBlank,
  CaretLeft,
  CaretRight,
  ChartBar,
  ChartLineUp,
  ClipboardText,
  CurrencyInr,
  FileText,
  Flag,
  Gear,
  HardHat,
  Handshake,
  ListChecks,
  MagnifyingGlass,
  Moon,
  Package,
  Receipt,
  SquaresFour,
  Sun,
  Truck,
  Users,
  Wallet,
  X,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from "react";
import { toast } from "sonner";
import { useDatabase } from "@/components/providers";
import { demoPersonByRole, homeForRole, mobileNavForRole, navigationForRole } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { labelize } from "@/lib/format";
import { demoTodayLabel } from "@/lib/dates";
import type { UserRole } from "@/types/common";
import { useUiStore } from "@/stores/ui-store";

const icons: Record<string, ComponentType<{ weight?: "regular" | "fill" }>> = {
  "/pulse": ChartLineUp,
  "/site": HardHat,
  "/activity": ClipboardText,
  "/crm/leads": Users,
  "/crm/clients": Handshake,
  "/crm/estimates": FileText,
  "/crm/quotations": Receipt,
  "/projects": Buildings,
  "/projects/schedule": CalendarBlank,
  "/operations/site-reports": ClipboardText,
  "/operations/tasks": ListChecks,
  "/projects/handover": Flag,
  "/operations/materials": Package,
  "/operations/requests": Package,
  "/operations/purchase-orders": Truck,
  "/operations/suppliers": Truck,
  "/operations/subcontractors": Handshake,
  "/finance": CurrencyInr,
  "/finance/job-costing": ChartBar,
  "/finance/expenses": Wallet,
  "/finance/invoices": Receipt,
  "/finance/vendor-bills": Receipt,
  "/reports": ChartBar,
  "/documents": FileText,
  "/team": Users,
  "/notifications": Bell,
  "/settings": Gear,
  "/modules": SquaresFour,
};

const roles: { id: UserRole; label: string; person: string }[] = [
  { id: "owner", label: "Owner", person: "Meera Kapoor" },
  { id: "site_engineer", label: "Site engineer", person: "Arjun Deshmukh" },
  { id: "project_manager", label: "Project manager", person: "Kavya Nair" },
  { id: "accountant", label: "Accountant", person: "Rohan Iyer" },
];

function applyTheme(theme: "light" | "dark" | "system") {
  const dark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const role = useUiStore((state) => state.role);
  const setRole = useUiStore((state) => state.setRole);
  const collapsed = useUiStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const theme = useUiStore((state) => state.theme);
  const setTheme = useUiStore((state) => state.setTheme);
  const moreOpen = useUiStore((state) => state.moreOpen);
  const setMoreOpen = useUiStore((state) => state.setMoreOpen);
  const searchOpen = useUiStore((state) => state.searchOpen);
  const setSearchOpen = useUiStore((state) => state.setSearchOpen);
  const query = useDatabase();
  const groups = navigationForRole(role);
  const mobile = mobileNavForRole(role);
  const unread = (query.data?.notifications ?? []).filter((item) => !item.read && (item.recipientRole === "all" || item.recipientRole === role)).length;

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside className={cn("no-print sticky top-0 hidden h-screen shrink-0 flex-col bg-sidebar text-sidebar-foreground md:flex", collapsed ? "w-[4.5rem]" : "w-80")}>
          <div className="flex items-center gap-3 px-4 py-5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-sm font-bold text-accent-foreground">Sf</div>
            {collapsed ? null : (
              <div>
                <p className="text-sm font-semibold">SiteFlow</p>
                <p className="text-xs text-sidebar-foreground/70">Demo workspace</p>
              </div>
            )}
          </div>
          <nav aria-label="Primary" className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
            {groups.map((group) => (
              <div key={group.id}>
                {collapsed ? null : <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/50">{group.label}</p>}
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = icons[item.href] ?? SquaresFour;
                    const active = pathname === item.href || (item.href !== "/projects" && pathname.startsWith(item.href));
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          title={item.label}
                          aria-current={active ? "page" : undefined}
                          className={cn("flex h-11 items-center gap-3 rounded-xl px-3 text-sm", active ? "bg-white/10 font-semibold" : "text-sidebar-foreground/80 hover:bg-white/5")}
                        >
                          <Icon weight={active ? "fill" : "regular"} />
                          {collapsed ? <span className="sr-only">{item.label}</span> : item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
          <button className="m-3 inline-flex h-11 items-center justify-center gap-2 rounded-xl text-sm text-sidebar-foreground/80 hover:bg-white/5" onClick={toggleSidebar} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            {collapsed ? <CaretRight /> : <CaretLeft />}
            {collapsed ? null : "Collapse"}
          </button>
        </aside>
        <div className="min-w-0 flex-1">
          <header className="no-print sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-border bg-background/90 px-3 backdrop-blur md:px-6">
            <button className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-card px-3 text-sm md:min-w-72" onClick={() => setSearchOpen(true)}>
              <MagnifyingGlass />
              <span className="text-muted-foreground">Search the demo</span>
              <span className="ml-auto hidden text-xs text-muted-foreground sm:inline">⌘K</span>
            </button>
            <div className="ml-auto flex items-center gap-2">
              <p className="hidden text-xs text-muted-foreground xl:block">Demo date {demoTodayLabel()}</p>
              <button className="inline-flex h-11 w-11 items-center justify-center rounded-xl hover:bg-muted" aria-label={theme === "dark" ? "Use light theme" : "Use dark theme"} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun /> : <Moon />}
              </button>
              <Link href="/notifications" className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl hover:bg-muted" aria-label={`Notifications, unread ${unread}`}>
                <Bell />
                {unread > 0 ? <span className="absolute right-1 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">{unread}</span> : null}
              </Link>
              <label className="sr-only" htmlFor="role-switch">Demo role</label>
              <select
                id="role-switch"
                className="h-11 max-w-40 rounded-xl border border-border bg-card px-2 text-sm"
                value={role}
                onChange={(event) => {
                  const next = event.target.value as UserRole;
                  setRole(next);
                  toast("Demo role changed", { description: "This menu is a sample. A real product would check permission on the server." });
                  router.push(homeForRole(next));
                }}
              >
                {roles.map((item) => (
                  <option key={item.id} value={item.id}>{item.person}</option>
                ))}
              </select>
            </div>
          </header>
          <main className="mx-auto w-full max-w-7xl px-4 py-6 pb-28 md:px-6 md:pb-10">{children}</main>
        </div>
      </div>
      <nav className="no-print fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-card md:hidden" aria-label="Mobile">
        {mobile.map((item) => {
          const Icon = icons[item.href] ?? SquaresFour;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={cn("flex min-h-16 flex-col items-center justify-center gap-1 text-[11px]", active ? "font-semibold text-foreground" : "text-muted-foreground")}>
              <Icon weight={active ? "fill" : "regular"} />
              <span className="max-w-16 truncate">{item.label}</span>
            </Link>
          );
        })}
        <button className="flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] text-muted-foreground" onClick={() => setMoreOpen(true)}>
          <SquaresFour />
          More
        </button>
      </nav>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <MoreSheet open={moreOpen} onOpenChange={setMoreOpen} />
    </div>
  );
}

function MoreSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const role = useUiStore((state) => state.role);
  const pathname = usePathname();
  const groups = navigationForRole(role);
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 md:hidden" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-card p-5 md:hidden">
          <div className="mb-3 flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold">More</Dialog.Title>
            <Dialog.Close className="inline-flex h-11 w-11 items-center justify-center" aria-label="Close"><X /></Dialog.Close>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">Demo workspace for the {labelize(role).toLowerCase()}. Hiding a menu is not a security control.</p>
          {groups.map((group) => (
            <div key={group.id} className="mb-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group.label}</p>
              <ul>
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={() => onOpenChange(false)} className={cn("flex h-11 items-center rounded-xl px-2 text-sm", pathname === item.href && "bg-muted font-semibold")}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const query = useDatabase();
  const router = useRouter();
  const [text, setText] = useState("");
  const results = useMemo(() => {
    const db = query.data;
    const needle = text.trim().toLowerCase();
    if (!db || needle.length < 2) return [];
    const rows: { href: string; title: string; meta: string }[] = [];
    db.projects.filter((item) => `${item.name} ${item.code}`.toLowerCase().includes(needle)).forEach((item) => rows.push({ href: `/projects/${item.id}`, title: item.name, meta: item.code }));
    db.leads.filter((item) => `${item.title} ${item.contactName}`.toLowerCase().includes(needle)).forEach((item) => rows.push({ href: `/crm/leads/${item.id}`, title: item.title, meta: "Lead" }));
    db.clients.filter((item) => item.name.toLowerCase().includes(needle)).forEach((item) => rows.push({ href: `/crm/clients/${item.id}`, title: item.name, meta: "Client" }));
    db.tasks.filter((item) => item.title.toLowerCase().includes(needle)).forEach((item) => rows.push({ href: `/projects/${item.projectId}/tasks`, title: item.title, meta: "Task" }));
    db.invoices.filter((item) => item.number.toLowerCase().includes(needle)).forEach((item) => rows.push({ href: `/finance/invoices/${item.id}`, title: item.number, meta: "Invoice" }));
    db.purchaseOrders.filter((item) => item.code.toLowerCase().includes(needle)).forEach((item) => rows.push({ href: "/operations/purchase-orders", title: item.code, meta: "Purchase order" }));
    db.suppliers.filter((item) => item.name.toLowerCase().includes(needle)).forEach((item) => rows.push({ href: `/operations/suppliers/${item.id}`, title: item.name, meta: "Supplier" }));
    db.documents.filter((item) => item.name.toLowerCase().includes(needle)).forEach((item) => rows.push({ href: "/documents", title: item.name, meta: "Document" }));
    return rows.slice(0, 12);
  }, [query.data, text]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-20 z-50 w-[min(92vw,36rem)] -translate-x-1/2 rounded-2xl border border-border bg-card p-3 shadow-xl">
          <Dialog.Title className="sr-only">Search</Dialog.Title>
          <input autoFocus value={text} onChange={(event) => setText(event.target.value)} placeholder="Projects, leads, invoices, suppliers" className="h-12 w-full rounded-xl bg-muted px-3 text-sm outline-none" />
          <ul className="mt-2 max-h-80 overflow-auto">
            {results.length === 0 ? <li className="px-3 py-6 text-sm text-muted-foreground">Type at least two characters. Results come from the demo data.</li> : null}
            {results.map((result) => (
              <li key={`${result.href}-${result.title}`}>
                <button
                  className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm hover:bg-muted"
                  onClick={() => {
                    onOpenChange(false);
                    setText("");
                    router.push(result.href);
                  }}
                >
                  <span>{result.title}</span>
                  <span className="text-xs text-muted-foreground">{result.meta}</span>
                </button>
              </li>
            ))}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export { demoPersonByRole };

import type { ReactNode } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { labelize } from "@/lib/format";
import { formatMoney } from "@/lib/format";

const tones = {
  neutral: "neutral",
  success: "success",
  warning: "warning",
  danger: "danger",
  info: "info",
} as const;

export function statusTone(status: string): keyof typeof tones {
  if (["paid", "completed", "approved", "received", "won", "on_track", "present", "accepted", "reviewed", "active"].includes(status)) return "success";
  if (["overdue", "delayed", "rejected", "lost", "cancelled", "absent", "declined"].includes(status)) return "danger";
  if (["at_risk", "pending_approval", "partial", "partially_received", "late", "submitted", "in_review", "under_review", "ordered", "handover", "half_day", "negotiation"].includes(status)) return "warning";
  if (["sent", "issued", "in_progress", "quotation"].includes(status)) return "info";
  return "neutral";
}

export function StatusPill({ status, label }: { status: string; label?: string }) {
  return <Badge tone={statusTone(status)}>{label ?? labelize(status)}</Badge>;
}

export function Money({ value, currency = "INR" }: { value: number; currency?: string }) {
  return <span className="tabular">{formatMoney(value, currency)}</span>;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  crumbs,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  crumbs?: { href: string; label: string }[];
}) {
  return (
    <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        {crumbs && crumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-2 flex flex-wrap gap-1 text-xs text-muted-foreground">
            {crumbs.map((crumb, index) => (
              <span key={crumb.href} className="flex items-center gap-1">
                {index > 0 ? <span aria-hidden>/</span> : null}
                <Link href={crumb.href} className="hover:text-foreground">{crumb.label}</Link>
              </span>
            ))}
          </nav>
        ) : null}
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{eyebrow}</p> : null}
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{body}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-danger/30 bg-card p-6" role="alert">
      <h2 className="text-lg font-semibold">This view could not be loaded</h2>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      <button className="mt-4 h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground" onClick={onRetry}>Try again</button>
    </div>
  );
}

export function Metric({ label, value, hint, href }: { label: string; value: ReactNode; hint?: string; href?: string }) {
  const body = (
    <article className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </article>
  );
  return href ? <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl">{body}</Link> : body;
}

export function Panel({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

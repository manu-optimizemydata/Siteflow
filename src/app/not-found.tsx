import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <h1 className="text-2xl font-semibold">This page is not in the demo</h1>
        <p className="mt-2 text-sm text-muted-foreground">Site reports, procurement, and finance are not all wired up yet.</p>
        <Link href="/pulse" className="mt-4 inline-flex h-11 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">Back to Pulse</Link>
      </div>
    </main>
  );
}

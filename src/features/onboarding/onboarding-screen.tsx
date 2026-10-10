"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/fields";
import { homeForRole } from "@/lib/navigation";
import { updateSettings } from "@/services/actions";
import { useUiStore } from "@/stores/ui-store";
import type { UserRole } from "@/types/common";

const steps = ["Welcome", "Company", "Work", "Role"];

export function OnboardingScreen() {
  const router = useRouter();
  const complete = useUiStore((state) => state.completeOnboarding);
  const setRole = useUiStore((state) => state.setRole);
  const [step, setStep] = useState(0);
  const [companyName, setCompanyName] = useState("Aarohan Buildworks");
  const [businessType, setBusinessType] = useState<"residential" | "commercial" | "both">("both");
  const [scale, setScale] = useState<"boutique" | "growing" | "multi_site">("growing");
  const [role, setLocalRole] = useState<UserRole>("owner");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function finish(nextRole = role) {
    setSaving(true);
    setError("");
    try {
      await updateSettings({ companyName, businessType, projectScale: scale, currency: "INR", locale: "en-IN", region: "IN-KA" }, "user_meera");
      setRole(nextRole);
      complete();
      router.push(homeForRole(nextRole));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not prepare the demo");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
      <section className="relative hidden overflow-hidden bg-[#14261e] text-[#f4f0e7] lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#d5e46a_0,transparent_32%),linear-gradient(160deg,#14261e,#1e3a2f_55%,#0e1914)]" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#d5e46a]">SiteFlow</p>
          <div>
            <h1 className="max-w-md text-5xl font-semibold leading-tight">From site work to business clarity</h1>
            <p className="mt-4 max-w-md text-base leading-7 text-white/75">A construction workspace for owners, site teams, project managers, and accountants. This sample uses the fictional company Aarohan Buildworks.</p>
          </div>
          <p className="text-sm text-white/60">Bengaluru · rupees · demo data only</p>
        </div>
      </section>
      <section className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-lg">
          <p className="text-sm font-semibold text-muted-foreground">Step {step + 1} of {steps.length}</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden>
            <div className="h-full bg-primary" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
          </div>
          {step === 0 ? (
            <div className="mt-8">
              <h2 className="text-3xl font-semibold">See a construction business that is already running</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">Explore leads, sites, cost, and collections without creating an account. Nothing is sent off this device.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button onClick={() => void finish("owner")} disabled={saving}>Enter the demo</Button>
                <Button variant="outline" onClick={() => setStep(1)}>Set up a sample</Button>
              </div>
            </div>
          ) : null}
          {step === 1 ? (
            <div className="mt-8 space-y-4">
              <h2 className="text-3xl font-semibold">Name the workspace</h2>
              <Field label="Company name" error={companyName.trim().length < 2 ? "Enter a company name" : undefined}>
                <Input value={companyName} onChange={(event) => setCompanyName(event.target.value)} />
              </Field>
              <Field label="Business type">
                <Select value={businessType} onChange={(event) => setBusinessType(event.target.value as typeof businessType)}>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="both">Residential and commercial</option>
                </Select>
              </Field>
            </div>
          ) : null}
          {step === 2 ? (
            <div className="mt-8 space-y-4">
              <h2 className="text-3xl font-semibold">How does the company work</h2>
              <Field label="Region and currency" hint="The default is India and rupees. You can change this later in settings.">
                <Input value="India · INR · Asia/Kolkata" readOnly />
              </Field>
              <Field label="Project size">
                <Select value={scale} onChange={(event) => setScale(event.target.value as typeof scale)}>
                  <option value="boutique">A few sites</option>
                  <option value="growing">Several sites at once</option>
                  <option value="multi_site">Many sites</option>
                </Select>
              </Field>
            </div>
          ) : null}
          {step === 3 ? (
            <div className="mt-8">
              <h2 className="text-3xl font-semibold">Whose view will you use</h2>
              <p className="mt-2 text-sm text-muted-foreground">Switching role is a simulation. It changes the workspace, not a real permission lock.</p>
              <div className="mt-4 grid gap-2">
                {([
                  ["owner", "Meera Kapoor", "Owner · Pulse and decisions"],
                  ["site_engineer", "Arjun Deshmukh", "Site engineer · daily reports"],
                  ["project_manager", "Kavya Nair", "Project manager · delivery"],
                  ["accountant", "Rohan Iyer", "Accountant · money in and money out"],
                ] as const).map(([id, name, detail]) => (
                  <button key={id} className={`rounded-2xl border p-4 text-left ${role === id ? "border-primary bg-card" : "border-border"}`} onClick={() => setLocalRole(id)}>
                    <span className="block font-semibold">{name}</span>
                    <span className="text-sm text-muted-foreground">{detail}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          {error ? <p className="mt-4 text-sm text-danger" role="alert">{error}</p> : null}
          {step > 0 ? (
            <div className="mt-8 flex gap-2">
              <Button variant="ghost" onClick={() => setStep((value) => value - 1)}>Back</Button>
              {step < 3 ? (
                <Button onClick={() => setStep((value) => value + 1)} disabled={companyName.trim().length < 2}>Next</Button>
              ) : (
                <Button onClick={() => void finish()} disabled={saving}>{saving ? "Preparing…" : "Enter the workspace"}</Button>
              )}
              <Button variant="ghost" onClick={() => void finish("owner")}>Skip</Button>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

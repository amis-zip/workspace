import Navbar from "../../components/Navbar";
import CopyrightDashboardClient from "./CopyrightDashboardClient";

export default function CopyrightOperationsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-4 md:px-6 py-10">
      <Navbar />

      <div className="max-w-7xl mx-auto">
        <a
          href="/faikerz"
          className="inline-block mb-8 text-sm text-zinc-600 hover:text-white transition"
        >
          ← Back to FAiKERZ
        </a>

        <section className="rounded-3xl border border-white/10 bg-zinc-950 p-8 md:p-10 mb-8">
          <p className="mb-3 text-xs tracking-[0.18em] uppercase text-red-400">
            Copyright Operations
          </p>

          <h1 className="text-4xl md:text-6xl font-semibold tracking-[0.06em] uppercase">
            Copyright Operations
          </h1>

          <p className="mt-6 text-zinc-400 leading-relaxed max-w-3xl">
            SNS data classification and recurring copyright monitoring schedule
            management for FAiKERZ copyright operations.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/faikerz/copyright-operations/view"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-zinc-200 transition"
            >
              Open Original Viewer
            </a>

            <a
              href="/files/copyright-schedule-june-v5.xlsx"
              download
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white hover:border-white/40 transition"
            >
              Download Excel
            </a>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Workstream
            </p>

            <h2 className="mt-4 text-2xl font-semibold">
              SNS Data Classification
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
              Tracks SNS copyright review tasks, classification workload,
              brand-specific queues, and schedule-sensitive review targets.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Workstream
            </p>

            <h2 className="mt-4 text-2xl font-semibold">
              Recurring Monitoring
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
              Tracks recurring copyright monitoring schedules, upcoming
              deadlines, reporting cycles, and workload status.
            </p>
          </div>
        </section>

        <CopyrightDashboardClient />
      </div>
    </main>
  );
}
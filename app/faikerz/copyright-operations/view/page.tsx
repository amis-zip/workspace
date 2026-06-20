import Navbar from "../../../components/Navbar";

export default function CopyrightOperationsViewPage() {
  const pdfUrl =
    "/files/copyright-schedule-june-v5.pdf#toolbar=1&navpanes=0&scrollbar=1&view=FitH";

  return (
    <main className="min-h-screen bg-black text-white px-4 md:px-6 py-10">
      <Navbar />

      <div className="max-w-[1600px] mx-auto">
        <a
          href="/faikerz/copyright-operations"
          className="inline-block mb-8 text-sm text-zinc-600 hover:text-white transition"
        >
          ← Back to Copyright Operations
        </a>

        <section className="mb-8 rounded-3xl border border-white/10 bg-zinc-950 p-8 md:p-10">
          <p className="mb-3 text-xs tracking-[0.18em] uppercase text-red-400">
            Original Excel Preview
          </p>

          <h1 className="text-4xl md:text-6xl font-semibold tracking-[0.06em] uppercase">
            Copyright Schedule
          </h1>

          <p className="mt-6 max-w-3xl text-zinc-400 leading-relaxed">
            View the original copyright operations schedule with its layout
            preserved as a PDF preview.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/files/copyright-schedule-june-v5.xlsx"
              download
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white hover:border-white/40 transition"
            >
              Download Original Excel
            </a>

            <a
              href="/files/copyright-schedule-june-v5.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-zinc-200 transition"
            >
              Open PDF
            </a>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-zinc-950 p-3 md:p-4">
          <iframe
            src={pdfUrl}
            title="Copyright Schedule PDF Preview"
            className="w-full rounded-2xl bg-white"
            style={{
              height: "82vh",
              border: "none",
            }}
          />
        </section>
      </div>
    </main>
  );
}
import Navbar from "../../components/Navbar";

export default function MarketDataExtractorPage() {
  return (
    <main className="min-h-screen bg-black text-white px-4 md:px-6 py-10">
      <Navbar />

      <div className="max-w-4xl mx-auto">
        <a
          href="/faikerz"
          className="inline-block mb-8 text-sm text-zinc-600 hover:text-white transition"
        >
          ← Back to FAiKERZ
        </a>

        <section className="rounded-3xl border border-white/10 bg-zinc-950 p-8 md:p-10">
          <p className="mb-3 text-xs tracking-[0.18em] uppercase text-zinc-500">
            FAiKERZ Tool
          </p>

          <h1 className="text-4xl md:text-6xl font-semibold tracking-[0.06em] uppercase">
            Market Data Extractor
          </h1>

          <p className="mt-6 text-zinc-400 leading-relaxed max-w-2xl">
            Extracts marketplace product data from store HTML and generates
            DB-ready Excel files for downstream operations.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href="/tools/MarketDataExtractor_v12.zip"
              download
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-medium text-black hover:bg-zinc-200 transition"
            >
              Download Tool
            </a>

            <a
              href="/faikerz"
              className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-zinc-300 hover:border-white/30 transition"
            >
              View FAiKERZ Tools
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

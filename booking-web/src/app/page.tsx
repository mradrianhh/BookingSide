import BookingCalendar from "@/components/BookingCalendar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-blue-500/5 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="mb-8 inline-block">
            <span className="inline-block px-4 py-2 bg-cyan-500/20 border border-cyan-400/50 rounded-full text-cyan-300 text-sm font-semibold">
              Arctic Adventure Awaits
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
            Experience the Frozen<br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">Arctic Ocean</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 mb-12 max-w-3xl mx-auto">
            Feel the rush of pristine arctic waters. Witness glaciers, arctic wildlife, and untamed beauty.
          </p>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-16 text-center">Why Choose Arctic Explorer?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20">
              <div className="text-5xl mb-4">❄️</div>
              <h3 className="text-xl font-bold text-white mb-3">Pristine Arctic</h3>
              <p className="text-slate-300">Experience untouched arctic landscapes, towering glaciers, and the raw power of nature.</p>
            </div>
            <div className="p-8 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20">
              <div className="text-5xl mb-4">🐋</div>
              <h3 className="text-xl font-bold text-white mb-3">Wildlife Encounters</h3>
              <p className="text-slate-300">Spot whales, seals, polar bears, and arctic birds with expert guides in their natural habitat.</p>
            </div>
            <div className="p-8 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20">
              <div className="text-5xl mb-4">🛥️</div>
              <h3 className="text-xl font-bold text-white mb-3">RIB Adventures</h3>
              <p className="text-slate-300">Swift, thrilling RIB boat expeditions built for safety and designed for maximum adventure.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 relative bg-gradient-to-r from-slate-900/50 to-blue-900/50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready for the Adventure of a Lifetime?</h2>
            <p className="text-xl text-slate-300 mb-6">Join us for an unforgettable journey through pristine Arctic waters. Our expert guides ensure your safety while you experience the raw beauty of nature.</p>
            <ul className="space-y-3 text-slate-300 inline-block text-left">
              <li>✓ Professional guides with Arctic expertise</li>
              <li>✓ Top-of-the-line safety equipment</li>
              <li>✓ Flexible booking and cancellation</li>
              <li>✓ Unforgettable memories guaranteed</li>
            </ul>
          </div>
          <BookingCalendar />
        </div>
      </section>
    </div>
  );
}

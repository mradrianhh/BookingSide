import AdminCalendar from "@/components/AdminCalendar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      <section className="py-12 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white leading-tight">
              Admin Dashboard
            </h1>
            <p className="text-xl text-slate-300">Manage available booking slots and view reservations</p>
          </div>
        </div>
      </section>

      <section className="py-12 relative">
        <div className="max-w-7xl mx-auto px-4">
          <AdminCalendar />
        </div>
      </section>
    </div>
  );
}

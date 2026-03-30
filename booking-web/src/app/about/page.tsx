export default function About() {
  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-white mb-8">About Arctic Explorer</h1>
        <p className="text-xl text-slate-300 mb-12 max-w-3xl">
          We are passionate about sharing the untamed beauty of the Arctic with adventurers from around the world.
        </p>
        
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
          <p className="text-slate-300 mb-4">
            Founded in 2010, Arctic Explorer began with a simple mission: to provide the most authentic and thrilling Arctic experiences possible. Our team of experienced guides have spent decades exploring these remote regions, and we're committed to sharing that knowledge and passion with you.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Safety & Conservation</h2>
          <p className="text-slate-300 mb-4">
            Your safety is our top priority. Every expedition is led by experienced guides who know the Arctic inside and out. We also work closely with conservation organizations to minimize our environmental impact and protect this pristine ecosystem.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-6">Contact Us</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-800 border border-cyan-500/20 p-8 rounded-xl">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">Get in Touch</h3>
              <p className="text-slate-300">📞 +1 (555) 123-4567</p>
              <p className="text-slate-300">📧 info@arcticexplorer.com</p>
            </div>
            <div className="bg-slate-800 border border-cyan-500/20 p-8 rounded-xl">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">Hours</h3>
              <p className="text-slate-300">Monday - Friday: 9AM - 6PM</p>
              <p className="text-slate-300">Saturday - Sunday: 10AM - 4PM</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

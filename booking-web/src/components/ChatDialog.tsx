'use client';

import { useState } from 'react';

export default function ChatDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setSubmitMessage('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        setSubmitMessage('Message sent! We\'ll get back to you soon.');
        setName('');
        setEmail('');
        setMessage('');
        setTimeout(() => setIsOpen(false), 2000);
      } else {
        setSubmitMessage('Error sending message. Please try again.');
      }
    } catch (error) {
      setSubmitMessage('Error sending message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full p-4 shadow-lg hover:shadow-cyan-500/50 transition-all z-40"
      >
        💬
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-cyan-500/30 rounded-xl p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Contact Us</h3>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSubmitMessage('');
                }}
                className="text-slate-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-cyan-500/30 rounded-lg text-white placeholder-slate-400"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-cyan-500/30 rounded-lg text-white placeholder-slate-400"
              />
              <textarea
                placeholder="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-cyan-500/30 rounded-lg text-white placeholder-slate-400 h-24"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-2 bg-cyan-500 text-slate-900 font-bold rounded-lg hover:bg-cyan-400 transition-all disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>

            {submitMessage && (
              <p className={`mt-4 text-sm text-center ${submitMessage.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                {submitMessage}
              </p>
            )}

            <div className="mt-6 pt-4 border-t border-slate-600 text-sm text-slate-300">
              <p className="mb-2">Or reach us directly:</p>
              <p>📞 +1 (555) 123-4567</p>
              <p>📧 info@arcticexplorer.com</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

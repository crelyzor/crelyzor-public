import { useState } from 'react';
import { api } from '../lib/api';

interface ContactFormProps {
  cardId: string;
  cardOwner: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function ContactForm({
  cardId,
  cardOwner,
  onClose,
  onSuccess,
}: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.submitContact(cardId, {
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        company: company.trim() || undefined,
        note: note.trim() || undefined,
      });
      onSuccess();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Form */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div>
            <h2 className="text-lg font-semibold text-neutral-950 tracking-tight">
              Share your info
            </h2>
            <p className="text-sm text-neutral-500 mt-0.5">with {cardOwner}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-neutral-200 transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-8 pt-4">
          <div className="space-y-3">
            {/* Name */}
            <input
              type="text"
              placeholder="Your name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="w-full h-12 px-4 rounded-xl border border-neutral-200 bg-neutral-50
                         text-sm text-neutral-900 placeholder:text-neutral-400
                         focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300
                         transition-all"
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-neutral-200 bg-neutral-50
                         text-sm text-neutral-900 placeholder:text-neutral-400
                         focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300
                         transition-all"
            />

            {/* Phone */}
            <input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-neutral-200 bg-neutral-50
                         text-sm text-neutral-900 placeholder:text-neutral-400
                         focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300
                         transition-all"
            />

            {/* Company */}
            <input
              type="text"
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-neutral-200 bg-neutral-50
                         text-sm text-neutral-900 placeholder:text-neutral-400
                         focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300
                         transition-all"
            />

            {/* Note */}
            <textarea
              placeholder="Add a note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50
                         text-sm text-neutral-900 placeholder:text-neutral-400
                         focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300
                         resize-none transition-all"
            />
          </div>

          {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !name.trim()}
            className="w-full h-12 mt-5 rounded-xl bg-neutral-900 text-white text-sm font-medium
                       hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </span>
            ) : (
              'Share Info'
            )}
          </button>

          <p className="text-[11px] text-neutral-400 text-center mt-4 leading-relaxed">
            Your info will be shared with {cardOwner} only.
            <br />
            We don't store or sell your data.
          </p>
        </form>
      </div>
    </div>
  );
}

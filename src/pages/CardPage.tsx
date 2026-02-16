import { useState, useEffect, type ReactNode } from 'react';
import { api } from '../lib/api';
import type { PublicCardResponse, CardLink, CardTheme } from '../types/card';
import { ContactForm } from './ContactForm';

// Link type → SVG icon mapping
const linkIcons: Record<string, ReactNode> = {
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.88 0 1.441 1.441 0 012.88 0z" />
    </svg>
  ),
};

function getDefaultIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4.5 h-4.5">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function getThemeVars(theme?: CardTheme) {
  const t = theme ?? {};
  const primary = t.primaryColor || '#171717';
  const bg = t.backgroundColor || '#ffffff';
  const isDark = t.darkMode ?? false;

  return {
    primary,
    bg,
    surface: isDark ? '#171717' : bg,
    text: isDark ? '#fafafa' : '#0a0a0a',
    textSecondary: isDark ? '#a3a3a3' : '#737373',
    textMuted: isDark ? '#525252' : '#a3a3a3',
    border: isDark ? '#262626' : '#f5f5f5',
    borderHover: isDark ? '#404040' : '#e5e5e5',
    hoverBg: isDark ? '#262626' : '#fafafa',
    fontFamily: t.fontFamily || 'Inter, system-ui, sans-serif',
    layout: t.layout || 'classic',
  };
}

interface CardPageProps {
  username: string;
  slug?: string;
}

export function CardPage({ username, slug }: CardPageProps) {
  const [data, setData] = useState<PublicCardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactSaved, setContactSaved] = useState(false);

  useEffect(() => {
    api
      .getCard(username, slug)
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [username, slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-8 h-8 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <p className="text-6xl font-light text-neutral-200 mb-4">404</p>
          <p className="text-neutral-500 text-sm">This card doesn't exist</p>
        </div>
      </div>
    );
  }

  const { user, card } = data;
  const contactFields = card.contactFields ?? {};
  const links = (card.links ?? []) as CardLink[];
  const tv = getThemeVars(card.theme);

  const handleLinkClick = (link: CardLink) => {
    api.trackClick(card.id, link.url).catch(() => {});
  };

  const handleSaveContact = () => {
    window.open(api.getVCardUrl(username, slug), '_blank');
  };

  return (
    <div
      className="min-h-screen flex items-start justify-center px-4 py-12 sm:py-20"
      style={{ backgroundColor: tv.border, fontFamily: tv.fontFamily }}
    >
      <div className="w-full max-w-md">
        {/* Card container */}
        <div
          className="rounded-3xl shadow-sm overflow-hidden"
          style={{ backgroundColor: tv.surface, border: `1px solid ${tv.border}` }}
        >
          {/* Cover / Header area */}
          {tv.layout !== 'minimal' && (
            <div
              className="relative h-32"
              style={{ background: `linear-gradient(135deg, ${tv.primary}, ${tv.primary}cc)` }}
            >
              {card.coverUrl && (
                <img
                  src={card.coverUrl}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
            </div>
          )}

          {/* Avatar - overlapping */}
          <div className={`relative px-6 ${tv.layout === 'minimal' ? 'pt-8' : ''}`}>
            <div className={tv.layout !== 'minimal' ? '-mt-12 mb-4' : 'mb-4'}>
              <div
                className="w-24 h-24 rounded-2xl shadow-lg overflow-hidden"
                style={{ border: `4px solid ${tv.surface}`, backgroundColor: tv.border }}
              >
                {card.avatarUrl || user.avatarUrl ? (
                  <img
                    src={card.avatarUrl || user.avatarUrl || ''}
                    alt={card.displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-2xl font-semibold" style={{ color: tv.textMuted }}>
                      {card.displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Name & title */}
            <div className="mb-6">
              <h1 className="text-xl font-semibold tracking-tight" style={{ color: tv.text }}>
                {card.displayName}
              </h1>
              {card.title && (
                <p className="text-sm mt-1" style={{ color: tv.textSecondary }}>{card.title}</p>
              )}
              {card.bio && (
                <p className="text-sm mt-3 leading-relaxed" style={{ color: tv.textSecondary }}>
                  {card.bio}
                </p>
              )}
            </div>

            {/* Contact actions */}
            <div className="flex gap-2 mb-6">
              {contactFields.email && (
                <a
                  href={`mailto:${contactFields.email}`}
                  className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-white text-sm font-medium transition-opacity hover:opacity-90"
                  style={{ backgroundColor: tv.primary }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  Email
                </a>
              )}
              {contactFields.phone && (
                <a
                  href={`tel:${contactFields.phone}`}
                  className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-medium transition-colors"
                  style={{ border: `1px solid ${tv.border}`, color: tv.textSecondary }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  Call
                </a>
              )}
              {contactFields.website && (
                <a
                  href={contactFields.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-xl transition-colors"
                  style={{ border: `1px solid ${tv.border}`, color: tv.textSecondary }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </a>
              )}
            </div>

            {/* Location */}
            {contactFields.location && (
              <div className="flex items-center gap-2 mb-6 text-sm" style={{ color: tv.textSecondary }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 shrink-0">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {contactFields.location}
              </div>
            )}
          </div>

          {/* Social links */}
          {links.length > 0 && (
            <div className="px-6 pb-6">
              <div className="h-px mb-5" style={{ backgroundColor: tv.border }} />
              <div className="space-y-2">
                {links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleLinkClick(link)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all group"
                    style={{ border: `1px solid ${tv.border}` }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = tv.borderHover;
                      e.currentTarget.style.backgroundColor = tv.hoverBg;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = tv.border;
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <span style={{ color: tv.textMuted }}>
                      {linkIcons[link.type] || getDefaultIcon()}
                    </span>
                    <span className="flex-1 text-sm font-medium" style={{ color: tv.text }}>
                      {link.label || link.type}
                    </span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" style={{ color: tv.textMuted }}>
                      <path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons below card */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleSaveContact}
            className="flex-1 flex items-center justify-center gap-2 h-12 rounded-2xl text-white text-sm font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: tv.primary }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17,21 17,13 7,13 7,21" />
              <polyline points="7,3 7,8 15,8" />
            </svg>
            Save Contact
          </button>
          <button
            onClick={() => setShowContactForm(true)}
            className="flex-1 flex items-center justify-center gap-2 h-12 rounded-2xl text-sm font-medium transition-colors"
            style={{ backgroundColor: tv.surface, border: `1px solid ${tv.border}`, color: tv.textSecondary }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
            Share My Info
          </button>
        </div>

        {/* Book a Meeting button */}
        {contactFields.bookingUrl && (
          <a
            href={contactFields.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center justify-center gap-2 h-12 rounded-2xl text-sm font-medium transition-colors"
            style={{ backgroundColor: tv.surface, border: `1px solid ${tv.border}`, color: tv.text }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            Book a Meeting
          </a>
        )}

        {/* Footer */}
        <p className="text-center text-[11px] mt-8 tracking-wide" style={{ color: tv.textMuted }}>
          Powered by Calendar
        </p>
      </div>

      {/* Contact form modal */}
      {showContactForm && (
        <ContactForm
          cardId={card.id}
          cardOwner={card.displayName}
          onClose={() => setShowContactForm(false)}
          onSuccess={() => {
            setShowContactForm(false);
            setContactSaved(true);
          }}
        />
      )}

      {/* Success toast */}
      {contactSaved && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2 px-4 py-3 rounded-full bg-neutral-900 text-white text-sm shadow-xl">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-green-400">
              <polyline points="20,6 9,17 4,12" />
            </svg>
            Your info has been shared with {data.card.displayName}
          </div>
        </div>
      )}
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { HomeNavbar } from '@/components/HomeNavbar';

export const metadata: Metadata = {
  title: 'Privacy Policy — Crelyzor',
  description: 'Read the Crelyzor Privacy Policy.',
};

const LAST_UPDATED = 'April 22, 2025';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <HomeNavbar />

      <main className="max-w-3xl mx-auto px-5 sm:px-8 pt-32 pb-24">
        <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">
          Legal
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground mb-3">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground mb-12">
          Last updated: {LAST_UPDATED}
        </p>

        <div className="prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed space-y-8 text-foreground/80">

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">1. Information We Collect</h2>
            <p>We collect information you provide directly (name, email via Google OAuth), information generated through use of the Service (meeting recordings, transcripts, notes, tasks, calendar events), and standard usage data (IP address, browser type, pages visited).</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">2. How We Use Your Information</h2>
            <p>We use your information to provide and improve the Service, process your meetings and generate AI summaries, send you account-related notifications, and respond to support requests. We do not sell your data to third parties.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">3. AI Processing</h2>
            <p>Meeting audio and transcripts are processed using third-party AI services (including OpenAI and Deepgram) to generate summaries, tasks, and other content. These providers process data on our behalf under appropriate data processing agreements.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">4. Google Integration</h2>
            <p>If you connect Google Calendar, we access your calendar events solely to display them within Crelyzor and to create meeting blocks you explicitly request. We do not read, store, or share your Google data beyond what is necessary to provide these features.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">5. Data Storage & Security</h2>
            <p>Your data is stored on secure servers. We use industry-standard encryption in transit (TLS) and at rest. Access is restricted to authorised personnel only. No system is 100% secure — please use strong passwords and report any suspected breaches immediately.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">6. Data Retention</h2>
            <p>We retain your data for as long as your account is active. When you delete your account, your data is permanently deleted within 30 days. You may export your data at any time from Settings.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">7. Cookies</h2>
            <p>We use essential cookies for authentication and session management. We do not use advertising or tracking cookies.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">8. Third-Party Services</h2>
            <p>We use the following third-party services: Google OAuth (authentication), OpenAI (AI processing), Deepgram (transcription), and Recall.ai (meeting recording, Pro/Business plans only). Each is governed by their own privacy policies.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">9. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at{' '}
              <a href="mailto:support@crelyzor.com" className="underline underline-offset-2 hover:text-foreground transition-colors">
                support@crelyzor.com
              </a>. We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes via email or an in-app notice. Continued use of the Service constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">11. Contact</h2>
            <p>
              For privacy-related questions or data requests, contact us at{' '}
              <a href="mailto:support@crelyzor.com" className="underline underline-offset-2 hover:text-foreground transition-colors">
                support@crelyzor.com
              </a>.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex items-center gap-6">
          <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2">
            Terms of Service
          </Link>
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}

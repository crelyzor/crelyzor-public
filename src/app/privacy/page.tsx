import type { Metadata } from 'next';
import Link from 'next/link';
import { HomeNavbar } from '@/components/HomeNavbar';

export const metadata: Metadata = {
  title: 'Privacy Policy — Crelyzor',
  description: 'Read the Crelyzor Privacy Policy.',
};

const LAST_UPDATED = 'June 17, 2026';

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
            <h2 className="text-base font-semibold text-foreground mb-2">
              1. Information We Collect
            </h2>
            <p>
              We collect information you provide directly (name, email via
              Google OAuth), information generated through use of the Service
              (meeting recordings, transcripts, notes, tasks, calendar events),
              and standard usage data (IP address, browser type, pages visited).
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">
              2. How We Use Your Information
            </h2>
            <p>
              We use your information to provide and improve the Service,
              process your meetings and generate AI summaries, send you
              account-related notifications, and respond to support requests. We
              do not sell your data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">
              3. AI Processing
            </h2>
            <p>
              Meeting audio and transcripts you create within Crelyzor are
              processed using third-party AI services (including OpenAI and
              Deepgram) to generate summaries, tasks, and other content. These
              providers process this data on our behalf under appropriate data
              processing agreements, and do not use it to train their own
              models.
            </p>
            <p className="mt-3">
              We do <strong>not</strong> use any data obtained through Google
              Workspace APIs (such as your Google Calendar or Google Tasks data)
              to develop, improve, or train generalized or non-personalized AI
              and machine learning models. Google user data is never sent to
              third-party AI providers.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">
              4. Google Integration & Limited Use
            </h2>
            <p>
              If you connect your Google account, we access your Google Calendar
              and Google Tasks data solely to provide the features you
              explicitly request — displaying your calendar within Crelyzor,
              creating and updating meeting blocks, checking your availability,
              and syncing meeting action items to Google Tasks. We use this data
              only to provide and improve these user-facing features. We do not
              use it for advertising, we do not sell it, and we do not share it
              with third parties or AI providers.
            </p>
            <p className="mt-3">
              Crelyzor&apos;s use and transfer of information received from
              Google APIs to any other app will adhere to the{' '}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">
              5. Data Security
            </h2>
            <p>
              We take the security of your data seriously. Meeting transcripts,
              AI summaries, and notes are encrypted at rest using AES-256-GCM.
              Encryption is applied per-user: each account has its own
              encryption key managed by Google Cloud Key Management Service
              (KMS). Encryption keys are never stored alongside your data.
            </p>
            <p className="mt-3">
              When you delete your account, your encryption key is permanently
              destroyed. This means your encrypted data becomes
              cryptographically unrecoverable, even from our own backups. This
              practice, known as crypto-shredding, gives you a strong guarantee
              that deletion is final.
            </p>
            <p className="mt-3">
              All data is transmitted over HTTPS. Access to production systems
              is restricted to authorised personnel, and we conduct regular
              security reviews. No system is 100% secure. Please report any
              suspected vulnerabilities to us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">
              6. Data Retention
            </h2>
            <p>
              We retain your data for as long as your account is active. When
              you delete your account, your data is permanently deleted within
              30 days. You may export your data at any time from Settings.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">
              7. Cookies
            </h2>
            <p>
              We use essential cookies for authentication and session
              management. We do not use advertising or tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">
              8. Third-Party Services
            </h2>
            <p>
              We use the following third-party services: Google OAuth
              (authentication), OpenAI (AI processing), Deepgram
              (transcription), and Recall.ai (meeting recording, Pro/Business
              plans only). Each is governed by their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">
              9. Your Rights
            </h2>
            <p>
              You have the right to access, correct, or delete your personal
              data. To exercise these rights, contact us at{' '}
              <a
                href="mailto:support@crelyzor.app"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                support@crelyzor.app
              </a>
              . We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">
              10. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of significant changes via email or an in-app notice.
              Continued use of the Service constitutes acceptance of the updated
              policy.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">
              11. Contact
            </h2>
            <p>
              For privacy-related questions or data requests, contact us at{' '}
              <a
                href="mailto:support@crelyzor.app"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                support@crelyzor.app
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex items-center gap-6">
          <Link
            href="/terms"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            Terms of Service
          </Link>
          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}

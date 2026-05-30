/**
 * Phase 6 P14.a — Public invite preview shape.
 *
 * Mirrors the backend `GET /api/v1/invites/:token` response (no auth). Only
 * the fields the public preview surfaces — slug + invitee email are
 * intentionally absent on the public projection.
 */
export type PublicInvitePreview = {
  team: {
    name: string;
    logoUrl: string | null;
  };
  role: 'ADMIN' | 'MEMBER';
  inviter: { name: string };
  expiresAt: string;
};

/**
 * Phase 6 P14.c — Public team profile + scheduling shapes.
 *
 * Mirrors `teamPublicService.PublicTeamProfile` + `PublicTeamSchedulingProfile`
 * on the backend. Public projections only — never carry sensitive fields.
 */

export type PublicTeamRole = 'OWNER' | 'ADMIN' | 'MEMBER';

export interface PublicTeamMember {
  user: {
    id: string;
    name: string | null;
    username: string | null;
    avatarUrl: string | null;
  };
  role: PublicTeamRole;
  teamCard: {
    slug: string;
    displayName: string;
    avatarUrl: string | null;
  } | null;
}

export interface PublicTeamProfile {
  team: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    logoUrl: string | null;
    createdAt: string;
  };
  members: PublicTeamMember[];
  stats: { memberCount: number };
}

export interface PublicTeamSchedulingMember {
  user: {
    name: string | null;
    username: string | null;
    avatarUrl: string | null;
  };
  eventTypeCount: number;
}

export interface PublicTeamSchedulingProfile {
  team: {
    name: string;
    slug: string;
    description: string | null;
    logoUrl: string | null;
  };
  members: PublicTeamSchedulingMember[];
}

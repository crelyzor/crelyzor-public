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
  designation: string | null;
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

export interface PublicTeamCardMember {
  name: string | null;
  username: string | null;
  avatarUrl: string | null;
  designation: string | null;
  cardSlug: string | null;
}

// Phase 6 P14.d — single team-member's bookable event types.
// `locationType` is narrowed to the LocationType domain so it composes with
// `SchedulingEventType` from @/types/scheduling without a cast.
import type { LocationType } from '@/types/scheduling';

export interface PublicTeamMemberSchedulingEventType {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  duration: number;
  locationType: LocationType;
}

export interface PublicTeamMemberSchedulingProfile {
  team: { name: string; slug: string; logoUrl: string | null };
  user: {
    name: string | null;
    username: string;
    avatarUrl: string | null;
    timezone: string | null;
  };
  eventTypes: PublicTeamMemberSchedulingEventType[];
}

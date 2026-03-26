export type LocationType = 'IN_PERSON' | 'ONLINE';

export interface SchedulingEventType {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  duration: number; // minutes
  locationType: LocationType;
}

export interface SchedulingProfile {
  user: {
    username: string;
    name: string;
    avatarUrl: string | null;
    timezone: string | null;
  };
  eventTypes: SchedulingEventType[];
}

export interface TimeSlot {
  startTime: string; // ISO UTC
  endTime: string; // ISO UTC
}

export interface SlotsResponse {
  slots: TimeSlot[];
}

export interface BookingCreateInput {
  username: string;
  eventTypeSlug: string;
  startTime: string; // ISO UTC
  guestName: string;
  guestEmail: string;
  guestNote?: string;
  guestTimezone: string;
}

export interface BookingConfirmationData {
  booking: {
    id: string;
    startTime: string;
    endTime: string;
    timezone: string;
    status: string;
    guestName: string;
    guestEmail: string;
    guestNote?: string | null;
    host: {
      name: string;
      username: string;
    };
    eventType: {
      title: string;
      duration: number;
      locationType: LocationType;
    };
  };
}

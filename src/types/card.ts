export interface CardLink {
  type: string;
  url: string;
  label: string;
  icon?: string;
}

export interface CardContactFields {
  phone?: string;
  email?: string;
  location?: string;
  website?: string;
  bookingUrl?: string;
}

export interface CardTheme {
  primaryColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
  layout?: 'classic' | 'modern' | 'minimal';
  darkMode?: boolean;
}

export interface CardData {
  id: string;
  slug: string;
  displayName: string;
  title: string | null;
  bio: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
  links: CardLink[];
  contactFields: CardContactFields;
  theme: CardTheme;
  templateId: string;
  showQr: boolean;
  htmlContent: string | null;
  htmlBackContent: string | null;
}

export interface CardUser {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  plan: 'FREE' | 'PRO' | 'BUSINESS';
}

export interface PublicCardResponse {
  user: CardUser;
  card: CardData;
}

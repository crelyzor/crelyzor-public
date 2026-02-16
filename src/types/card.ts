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
}

export interface CardUser {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
}

export interface PublicCardResponse {
  user: CardUser;
  card: CardData;
}

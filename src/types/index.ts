export interface Person {
  name: string;
  emails?: Email[];
  phones?: Phone[];
  address?: string | null;
  mapUrl?: string | null;
  bio?: string | null;
  companyId: number;
  company?: Company | null;
  designation?: string | null;
  image?: string | null;
  cover?: string | null;
  links?: Link[];
  attachmentUrl?: string | null;
  attachmentFileName?: string | null;
  slug?: string | null;
  id?: number | null;
  theme: string | null;
  btnColor: string | null;
  template: string | null;
  isDarkMode: boolean | null;
}

export interface Company {
  id?: number;
  name: string;
  phone: string | null;
  website: string | null;
  address: string | null;
  logo: string | null;
  persons?: Person[];
  createdAt?: Date;
  updatedAt?: Date | null;
}

export interface Link {
  id: number;
  label: string;
  url: string;
  icon: string;
  category?: string | null;
}

export interface Phone {
  id: number;
  phone?: string | null;
  category?: string | null;
}
export interface Email {
  id: number;
  email?: string | null;
  category?: string | null;
}

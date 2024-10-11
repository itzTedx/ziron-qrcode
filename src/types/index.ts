export interface Person {
  name: string;
  email?: string | null;
  phone: string;
  address?: string | null;
  bio?: string | null;
  companyId: number;
  company?: Company | null;
  designation?: string | null;
  image?: string | null;
  cover?: string | null;
  links?: Link[];
  slug?: string | null;
  id?: number | null;
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
  label: string;
  href: string;
  id?: string | undefined;
}

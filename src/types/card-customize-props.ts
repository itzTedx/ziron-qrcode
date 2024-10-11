export interface CardCustomizeProps {
  data: Company[];
  isEditMode: boolean;
  initialData?: Person;
}

export interface Person {
  name: string;
  email?: string;
  phone: string;
  address?: string;
  bio?: string;
  companyId: number;
  company?: Company;
  designation?: string;
  image?: string;
  cover?: string;
  links?: Link[];
  slug?: string;
  id?: number;
}

export interface Company {
  id?: number;
  name: string;
  phone: string | null;
  website: string | null;
  address: string | null;
  logo: string | null;
  persons: Person[];
  createdAt?: Date;
  updatedAt?: Date | null;
}

export interface Link {
  label: string;
  href: string;
  id?: string | undefined;
}

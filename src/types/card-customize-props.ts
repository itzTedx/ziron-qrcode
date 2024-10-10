export interface CardCustomizeProps {
  data: Company[];
  isEditMode: boolean;
  initialData: Person | null;
}

export interface Person {
  name: string;
  email: string | null;
  phone: string;
  address: string | null;
  bio: string | null;
  companyId: number;
  company: Company;
  designation: string | null;
  image: string;
  cover: string;
  slug: string | null;
  id: number;
}

export interface Company {
  id?: number;
  name: string;
  phone: string | null;
  website: string | null;
  address: string | null;
  logo: string | null;
  createdAt?: Date;
  updatedAt?: Date | null;
}

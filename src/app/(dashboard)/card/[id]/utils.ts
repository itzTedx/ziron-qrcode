import { Person } from "@/types";

export const transformInitialData = (data: Person | undefined, id: string) => {
  if (!data) {
    return {
      emails: [{ email: "", label: "primary" }],
      phones: [{ phone: "", label: "primary" }],
      links: undefined,
      template: "default",
    };
  }

  return {
    ...data,
    id: parseInt(id),
    phones: data.phones?.map((phone) => ({
      ...phone,
      id: phone.id.toString(),
      phone: phone.phone?.toString(),
    })),
    emails: data.emails?.map((email) => ({
      id: email.id.toString(),
      email: email.email ?? undefined,
      label: email.category ?? "primary",
    })),
    bio: data.bio ?? undefined,
    mapUrl: data.mapUrl ?? undefined,
    template: data.template ?? undefined,
    theme: data.theme ?? undefined,
    btnColor: data.btnColor ?? undefined,
    links: data.links?.map((link) => ({
      ...link,
      id: link.id?.toString(),
    })),
  };
};

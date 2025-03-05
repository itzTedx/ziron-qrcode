import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { InferResultType } from "./db";

export const UserRoles = ["admin", "user"] as const;
export type UserRole = (typeof UserRoles)[number];
export const userRoleEnum = pgEnum("user_role", UserRoles);

export const UserTable = pgTable("users", {
  id: uuid().primaryKey().notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  salt: text("salt").notNull(),
  role: userRoleEnum().notNull().default("user"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const companies = pgTable("companies", {
  id: serial("id").primaryKey().notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  website: text("website"),
  address: text("address"),
  logo: text("logo"),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const companyRelations = relations(companies, ({ many }) => ({
  persons: many(persons),
}));

export const persons = pgTable("persons", {
  id: serial("id").primaryKey().notNull(),
  name: text("name").notNull(),

  address: text("address"),
  mapUrl: text("map_url"),
  bio: text("bio"),
  designation: text("designation"),
  companyId: integer("companyId")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),

  attachmentUrl: text("attachmentUrl"),
  attachmentFileName: text("attachmentFileName"),
  image: text("logo").notNull(),
  cover: text("cover").notNull(),

  slug: text("slug").unique(),

  template: text("template").default("default").notNull(),
  theme: text("theme_color").default("#4938ff").notNull(),
  btnColor: text("button_color").default("#4938ff").notNull(),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const phones = pgTable("phones", {
  id: serial("id").primaryKey().notNull(),
  phone: text("phone"),
  personId: integer("personId")
    .notNull()
    .references(() => persons.id, { onDelete: "cascade" }),
  order: real("order").notNull(),
  label: text("label").notNull().default("primary"),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const emails = pgTable("emails", {
  id: serial("id").primaryKey().notNull(),
  email: text("email"),
  personId: integer("personId")
    .notNull()
    .references(() => persons.id, { onDelete: "cascade" }),
  order: real("order").notNull(),
  label: text("label").notNull().default("primary"),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const links = pgTable("links", {
  id: serial("id").primaryKey().notNull(),
  label: text("title").notNull(),
  url: text("url").notNull(),
  icon: text("icon").notNull(),
  personId: integer("personId")
    .notNull()
    .references(() => persons.id, { onDelete: "cascade" }),
  category: text("category"),
  order: real("order").notNull(),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const personsRelations = relations(persons, ({ one, many }) => ({
  company: one(companies, {
    fields: [persons.companyId],
    references: [companies.id],
  }),
  links: many(links),
  emails: many(emails),
  phones: many(phones),
  // attachments: one(attachments),
}));

export const personLinksRelations = relations(links, ({ one }) => ({
  person: one(persons, {
    fields: [links.personId],
    references: [persons.id],
    relationName: "personLinks",
  }),
}));
export const personPhonesRelations = relations(phones, ({ one }) => ({
  person: one(persons, {
    fields: [phones.personId],
    references: [persons.id],
    relationName: "personPhones",
  }),
}));
export const personEmailsRelations = relations(emails, ({ one }) => ({
  person: one(persons, {
    fields: [emails.personId],
    references: [persons.id],
    relationName: "personEmails",
  }),
}));

export type PersonType = InferResultType<
  "persons",
  {
    emails: true;
    phones: true;
    company: true;
    links: true;
  }
>;
export type CompanyType = InferResultType<
  "companies",
  {
    persons: true;
  }
>;

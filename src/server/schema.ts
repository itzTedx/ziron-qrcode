import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  real,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

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
  // email: text("email"),
  // phone: text("phone"),
  address: text("address"),
  bio: text("bio"),

  companyId: integer("companyId").notNull(),
  designation: text("designation"),
  attachmentUrl: text("attachmentUrl"),
  attachmentFileName: text("attachmentFileName"),

  image: text("logo").notNull(),
  cover: text("cover").notNull(),

  slug: text("slug").unique(),

  template: text("template").default("default"),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const phones = pgTable("phones", {
  id: serial("id").primaryKey().notNull(),
  phone: text("phone"),
  personId: integer("personId").notNull(),
  order: real("order").notNull(),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const emails = pgTable("emails", {
  id: serial("id").primaryKey().notNull(),
  email: text("email"),
  personId: integer("personId").notNull(),
  order: real("order").notNull(),

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
  personId: integer("personId").notNull(),
  // category: text("category").notNull(),
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

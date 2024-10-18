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
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  bio: text("bio"),

  companyId: integer("companyId").notNull(),
  designation: text("designation"),

  image: text("logo").notNull(),
  cover: text("cover").notNull(),

  slug: text("slug").unique(),

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
}));

export const personLinksRelations = relations(links, ({ one }) => ({
  product: one(persons, {
    fields: [links.personId],
    references: [persons.id],
    relationName: "personLinks",
  }),
}));

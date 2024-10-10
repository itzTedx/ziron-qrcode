import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

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
  phone: text("phone").notNull(),
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

export const personsRelations = relations(persons, ({ one }) => ({
  company: one(companies, {
    fields: [persons.companyId],
    references: [companies.id],
  }),
}));

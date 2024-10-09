import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const Company = pgTable("Company", {
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

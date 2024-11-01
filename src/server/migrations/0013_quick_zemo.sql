CREATE TABLE IF NOT EXISTS "emails" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text,
	"category" text,
	"personId" integer NOT NULL,
	"order" real NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "phones" (
	"id" serial PRIMARY KEY NOT NULL,
	"phone" text,
	"category" text,
	"personId" integer NOT NULL,
	"order" real NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "persons" DROP COLUMN IF EXISTS "email";--> statement-breakpoint
ALTER TABLE "persons" DROP COLUMN IF EXISTS "phone";
CREATE TABLE IF NOT EXISTS "companies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" text,
	"website" text,
	"address" text,
	"logo" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "emails" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text,
	"personId" integer NOT NULL,
	"order" real NOT NULL,
	"label" text DEFAULT 'primary' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "links" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"icon" text NOT NULL,
	"personId" integer NOT NULL,
	"category" text,
	"order" real NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "persons" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text,
	"bio" text,
	"designation" text,
	"companyId" integer NOT NULL,
	"attachmentUrl" text,
	"attachmentFileName" text,
	"logo" text NOT NULL,
	"cover" text NOT NULL,
	"slug" text,
	"template" text DEFAULT 'default' NOT NULL,
	"theme_color" text DEFAULT '#4938ff' NOT NULL,
	"button_color" text DEFAULT '#4938ff' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "persons_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "phones" (
	"id" serial PRIMARY KEY NOT NULL,
	"phone" text,
	"personId" integer NOT NULL,
	"order" real NOT NULL,
	"label" text DEFAULT 'primary' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);

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
	"map_url" text,
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
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "emails" ADD CONSTRAINT "emails_personId_persons_id_fk" FOREIGN KEY ("personId") REFERENCES "public"."persons"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "links" ADD CONSTRAINT "links_personId_persons_id_fk" FOREIGN KEY ("personId") REFERENCES "public"."persons"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "persons" ADD CONSTRAINT "persons_companyId_companies_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "phones" ADD CONSTRAINT "phones_personId_persons_id_fk" FOREIGN KEY ("personId") REFERENCES "public"."persons"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

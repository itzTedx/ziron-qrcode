CREATE TABLE IF NOT EXISTS "person" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text NOT NULL,
	"address" text,
	"companyId" integer NOT NULL,
	"designation" text,
	"logo" text NOT NULL,
	"cover" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "person" ADD CONSTRAINT "person_companyId_Company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

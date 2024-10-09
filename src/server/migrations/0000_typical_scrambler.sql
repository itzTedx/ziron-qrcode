CREATE TABLE IF NOT EXISTS "Company" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"phone" text,
	"website" text,
	"address" text,
	"logo" text
);

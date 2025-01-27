ALTER TABLE "persons" ALTER COLUMN "template" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "persons" ALTER COLUMN "theme_color" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "persons" ALTER COLUMN "button_color" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "emails" ADD COLUMN "label" text DEFAULT 'primary' NOT NULL;--> statement-breakpoint
ALTER TABLE "phones" ADD COLUMN "label" text DEFAULT 'primary' NOT NULL;
ALTER TABLE "Company" RENAME TO "company";--> statement-breakpoint
ALTER TABLE "person" DROP CONSTRAINT "person_companyId_Company_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "person" ADD CONSTRAINT "person_companyId_company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

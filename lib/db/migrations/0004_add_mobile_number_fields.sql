ALTER TABLE "users" ADD COLUMN "mobile_country_code" varchar(5);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "mobile_number" varchar(20);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "mobile_verified" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "mobile_verification_token" varchar(10);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "mobile_verification_expires" timestamp;

CREATE TABLE "accounts" (
	"provider" varchar(24),
	"provider_account_id" varchar(255),
	"password" varchar(255),
	"user_id" varchar(24) NOT NULL,
	CONSTRAINT "accounts_pkey" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "groups" (
	"id" varchar(24) PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"user_id" varchar(24) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notes" (
	"id" varchar(24) PRIMARY KEY,
	"title" varchar(255),
	"content" text NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp,
	"user_id" varchar(24) NOT NULL,
	"group_id" varchar(24)
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" varchar(24) PRIMARY KEY,
	"token" varchar(255) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"user_id" varchar(24) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(24) PRIMARY KEY,
	"username" varchar(24) NOT NULL,
	"email" varchar(255) NOT NULL,
	"image" varchar(255),
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE INDEX "accounts_user_id_idx" ON "accounts" ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_username_uq_idx" ON "users" ("username");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_uq_idx" ON "users" ("email");--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_group_id_groups_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
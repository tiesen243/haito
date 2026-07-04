CREATE TABLE "accounts" (
	"provider" varchar(50) NOT NULL,
	"provider_account_id" varchar(100) NOT NULL,
	"password" varchar(255),
	"user_id" varchar(24) NOT NULL,
	CONSTRAINT "accounts_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"title" varchar(100) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" varchar(24) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"token" varchar(64) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp NOT NULL,
	"user_id" varchar(24) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"username" varchar(50) NOT NULL,
	"email" varchar(100) NOT NULL,
	"image" varchar(255),
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accounts_userId_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sessions_token_uq_idx" ON "sessions" USING btree ("token");--> statement-breakpoint
CREATE UNIQUE INDEX "users_username_uq_idx" ON "users" USING btree ("username");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_uq_idx" ON "users" USING btree ("email");
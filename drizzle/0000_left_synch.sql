CREATE TABLE IF NOT EXISTS "gb-games_account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "gb-games_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gb-games_authenticator" (
	"credentialID" text NOT NULL,
	"userId" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "gb-games_authenticator_userId_credentialID_pk" PRIMARY KEY("userId","credentialID"),
	CONSTRAINT "gb-games_authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gb-games_gameRoom" (
	"id" text PRIMARY KEY NOT NULL,
	"gameType" text NOT NULL,
	"player1" text NOT NULL,
	"player2" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gb-games_session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gb-games_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" timestamp,
	"image" text,
	CONSTRAINT "gb-games_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gb-games_verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "gb-games_verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gb-games_account" ADD CONSTRAINT "gb-games_account_userId_gb-games_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."gb-games_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gb-games_authenticator" ADD CONSTRAINT "gb-games_authenticator_userId_gb-games_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."gb-games_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gb-games_gameRoom" ADD CONSTRAINT "gb-games_gameRoom_player1_gb-games_user_id_fk" FOREIGN KEY ("player1") REFERENCES "public"."gb-games_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gb-games_gameRoom" ADD CONSTRAINT "gb-games_gameRoom_player2_gb-games_user_id_fk" FOREIGN KEY ("player2") REFERENCES "public"."gb-games_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gb-games_session" ADD CONSTRAINT "gb-games_session_userId_gb-games_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."gb-games_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gameType_idx" ON "gb-games_gameRoom" USING btree ("gameType");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "player1_idx" ON "gb-games_gameRoom" USING btree ("player1");
CREATE TABLE IF NOT EXISTS "share_reports" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" integer NOT NULL REFERENCES "users"("id"),
  "share_link" text NOT NULL,
  "proof_image" text NOT NULL,
  "status" text NOT NULL DEFAULT 'pending',
  "created_at" timestamp NOT NULL DEFAULT now(),
  "processed_at" timestamp,
  "processed_by" integer
);
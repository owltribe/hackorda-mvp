ALTER TABLE "quiz_history" ADD COLUMN "question_ids" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "quiz_history" ADD COLUMN "status" varchar(50) DEFAULT 'in_progress' NOT NULL;
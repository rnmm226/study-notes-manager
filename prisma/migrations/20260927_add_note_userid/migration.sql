-- Add userId to Note and link to user
ALTER TABLE "Note" ADD COLUMN "userId" TEXT;

-- Assign existing notes to first user (cleanup for dev)
UPDATE "Note" SET "userId" = (SELECT id FROM "user" LIMIT 1) WHERE "userId" IS NULL;

-- Make it required
ALTER TABLE "Note" ALTER COLUMN "userId" SET NOT NULL;

-- Foreign key
ALTER TABLE "Note" ADD CONSTRAINT "Note_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Index
CREATE INDEX "Note_userId_idx" ON "Note"("userId");

-- Also add sharing fields if not already there (idempotent)
ALTER TABLE "Note" ADD COLUMN IF NOT EXISTS "isPublic" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Note" ADD COLUMN IF NOT EXISTS "shareToken" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "Note_shareToken_key" ON "Note"("shareToken");

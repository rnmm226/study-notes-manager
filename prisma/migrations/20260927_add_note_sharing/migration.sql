-- Add public sharing fields to Note
ALTER TABLE "Note" ADD COLUMN "isPublic" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Note" ADD COLUMN "shareToken" TEXT;
CREATE UNIQUE INDEX "Note_shareToken_key" ON "Note"("shareToken");

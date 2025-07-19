-- DropIndex
DROP INDEX "Subscriber_email_key";

-- AlterTable
ALTER TABLE "Subscriber" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

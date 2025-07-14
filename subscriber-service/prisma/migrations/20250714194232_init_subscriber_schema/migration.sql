/*
  Warnings:

  - You are about to drop the column `subscriberListId` on the `Subscriber` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Subscriber" DROP COLUMN "subscriberListId";

-- CreateTable
CREATE TABLE "SubscriberOnList" (
    "subscriberId" TEXT NOT NULL,
    "subscriberListId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriberOnList_pkey" PRIMARY KEY ("subscriberId","subscriberListId")
);

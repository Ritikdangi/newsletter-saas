/*
  Warnings:

  - You are about to drop the column `createdAt` on the `SubscriberOnList` table. All the data in the column will be lost.
  - Added the required column `tenantId` to the `Subscriber` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Subscriber` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SubscriberList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscriber" ADD COLUMN     "tenantId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "SubscriberList" ADD COLUMN     "description" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "SubscriberOnList" DROP COLUMN "createdAt",
ADD COLUMN     "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

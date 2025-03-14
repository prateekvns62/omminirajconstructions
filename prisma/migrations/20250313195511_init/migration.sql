/*
  Warnings:

  - Added the required column `priority` to the `activeCertificate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `activecertificate` ADD COLUMN `priority` INTEGER NOT NULL;

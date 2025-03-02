/*
  Warnings:

  - You are about to drop the `contactusreply` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `contactusreply`;

-- CreateTable
CREATE TABLE `contact_us_reply` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contact_us_id` INTEGER NOT NULL,
    `message` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

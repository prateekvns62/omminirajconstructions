-- CreateTable
CREATE TABLE `ContactUsReply` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contact_us_id` INTEGER NOT NULL,
    `message` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

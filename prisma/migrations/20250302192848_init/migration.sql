-- CreateTable
CREATE TABLE `franchise_record` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `doYouHave` VARCHAR(191) NOT NULL,
    `mobileNumber` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `gstNumber` VARCHAR(191) NULL,
    `franchiseId` VARCHAR(191) NULL,
    `franchiseCertificateUrl` VARCHAR(191) NULL,
    `aadhaarCardNumber` VARCHAR(191) NOT NULL,
    `accountNumber` VARCHAR(191) NOT NULL,
    `ifscCode` VARCHAR(191) NOT NULL,
    `passbookCopy` VARCHAR(191) NOT NULL,
    `panCardCopy` VARCHAR(191) NOT NULL,
    `aadharFrontCopy` VARCHAR(191) NOT NULL,
    `aadharBackCopy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `franchise_record_email_key`(`email`),
    UNIQUE INDEX `franchise_record_mobileNumber_key`(`mobileNumber`),
    UNIQUE INDEX `franchise_record_franchiseId_key`(`franchiseId`),
    UNIQUE INDEX `franchise_record_aadhaarCardNumber_key`(`aadhaarCardNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

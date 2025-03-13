-- CreateTable
CREATE TABLE `booking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookingId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `aadhaarCardNumber` INTEGER NOT NULL,
    `workBy` VARCHAR(191) NOT NULL,
    `workThrough` VARCHAR(191) NOT NULL,
    `plotSize` VARCHAR(191) NOT NULL,
    `area` INTEGER NOT NULL,
    `photo` VARCHAR(191) NULL,
    `aadharFrontCopy` VARCHAR(191) NULL,
    `aadharBackCopy` VARCHAR(191) NULL,
    `panCardCopy` VARCHAR(191) NULL,
    `registryCopy` VARCHAR(191) NULL,
    `franchise_id` VARCHAR(191) NULL,
    `status` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `booking_bookingId_key`(`bookingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `paymentDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookingId` VARCHAR(191) NOT NULL,
    `paymentMethod` VARCHAR(191) NOT NULL,
    `transactionId` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `paymentDetails_bookingId_key`(`bookingId`),
    UNIQUE INDEX `paymentDetails_transactionId_key`(`transactionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `paymentDetails` ADD CONSTRAINT `paymentDetails_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `booking`(`bookingId`) ON DELETE CASCADE ON UPDATE CASCADE;

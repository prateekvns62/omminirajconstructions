-- CreateTable
CREATE TABLE `activeCertificate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `pdf` VARCHAR(191) NOT NULL,
    `img` VARCHAR(191) NOT NULL,
    `certificateId` VARCHAR(191) NOT NULL,
    `certificateApprovalDate` DATETIME(3) NOT NULL,
    `expiredDate` DATETIME(3) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `showOnHome` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `activeCertificate_identifier_key`(`identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ourServices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `serviceTitle` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `showOnHome` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customerTestimonials` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerName` VARCHAR(191) NOT NULL,
    `reviewMessage` VARCHAR(191) NOT NULL,
    `showOnHome` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `branches` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `branchCode` VARCHAR(191) NOT NULL,
    `branchName` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `priority` INTEGER NOT NULL,
    `mapIframe` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `branches_branchCode_key`(`branchCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Distributor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `contact` VARCHAR(191) NOT NULL,
    `village` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `tahsil` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `branchCode` VARCHAR(191) NOT NULL,
    `mapIframe` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `imageGallery` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ourClients` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` INTEGER NOT NULL,
    `srNo` INTEGER NULL,
    `name` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ongoingProjects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` INTEGER NOT NULL,
    `linkType` INTEGER NOT NULL,
    `youtubeLink` VARCHAR(191) NULL,
    `iframeLink` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

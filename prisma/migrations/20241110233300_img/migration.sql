/*
  Warnings:

  - Added the required column `img` to the `Servicios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `servicios` ADD COLUMN `img` VARCHAR(191) NOT NULL;

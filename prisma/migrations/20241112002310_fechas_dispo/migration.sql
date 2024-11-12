/*
  Warnings:

  - You are about to drop the column `fecha_hora` on the `citas` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_disponibilidad]` on the table `Citas` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_disponibilidad` to the `Citas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `citas` DROP COLUMN `fecha_hora`,
    ADD COLUMN `id_disponibilidad` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `DisponibilidadServicio` (
    `id_disponibilidad` VARCHAR(191) NOT NULL,
    `id_servicio` VARCHAR(191) NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `estado` ENUM('disponible', 'reservado', 'no_disponible') NOT NULL DEFAULT 'disponible',

    INDEX `id_servicio`(`id_servicio`),
    PRIMARY KEY (`id_disponibilidad`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Citas_id_disponibilidad_key` ON `Citas`(`id_disponibilidad`);

-- AddForeignKey
ALTER TABLE `Citas` ADD CONSTRAINT `Citas_id_disponibilidad_fkey` FOREIGN KEY (`id_disponibilidad`) REFERENCES `DisponibilidadServicio`(`id_disponibilidad`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DisponibilidadServicio` ADD CONSTRAINT `DisponibilidadServicio_id_servicio_fkey` FOREIGN KEY (`id_servicio`) REFERENCES `Servicios`(`id_servicio`) ON DELETE CASCADE ON UPDATE CASCADE;

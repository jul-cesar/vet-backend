/*
  Warnings:

  - You are about to alter the column `monto` on the `pagos` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(10,3)`.
  - You are about to alter the column `precio` on the `servicios` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(10,3)`.

*/
-- AlterTable
ALTER TABLE `pagos` MODIFY `monto` DECIMAL(10, 3) NOT NULL;

-- AlterTable
ALTER TABLE `servicios` MODIFY `precio` DECIMAL(10, 3) NOT NULL;

-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `rol` ENUM('cliente', 'doctor', 'admin') NOT NULL DEFAULT 'cliente';

-- CreateTable
CREATE TABLE `_doctorServicios` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_doctorServicios_AB_unique`(`A`, `B`),
    INDEX `_doctorServicios_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_doctorServicios` ADD CONSTRAINT `_doctorServicios_A_fkey` FOREIGN KEY (`A`) REFERENCES `Servicios`(`id_servicio`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_doctorServicios` ADD CONSTRAINT `_doctorServicios_B_fkey` FOREIGN KEY (`B`) REFERENCES `Usuarios`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `usuarios` RENAME INDEX `email` TO `Usuarios_email_key`;

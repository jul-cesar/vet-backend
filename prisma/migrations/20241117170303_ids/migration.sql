/*
  Warnings:

  - The values [tarjeta_credito,tarjeta_debito,transferencia,efectivo] on the enum `Pagos_metodo_pago` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `historialcitas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `historialcitas` DROP FOREIGN KEY `HistorialCitas_id_cita_fkey`;

-- AlterTable
ALTER TABLE `pagos` MODIFY `metodo_pago` ENUM('TarjetaDeCredito', 'TarjetaDeDebito', 'TransferenciaBancaria', 'Efectivo') NOT NULL;

-- DropTable
DROP TABLE `historialcitas`;

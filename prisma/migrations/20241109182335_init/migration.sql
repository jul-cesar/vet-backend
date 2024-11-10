-- CreateTable
CREATE TABLE `Citas` (
    `id_cita` VARCHAR(191) NOT NULL,
    `id_usuario` VARCHAR(191) NOT NULL,
    `id_mascota` VARCHAR(191) NOT NULL,
    `id_servicio` VARCHAR(191) NOT NULL,
    `fecha_hora` DATETIME(0) NOT NULL,
    `descripcion` TEXT NULL,
    `estado` ENUM('programada', 'completada', 'cancelada') NOT NULL DEFAULT 'programada',
    `fecha_creacion` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `id_mascota`(`id_mascota`),
    INDEX `id_servicio`(`id_servicio`),
    INDEX `id_usuario`(`id_usuario`),
    PRIMARY KEY (`id_cita`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Facturas` (
    `id_factura` VARCHAR(191) NOT NULL,
    `id_pago` VARCHAR(191) NOT NULL,
    `fecha_emision` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `monto_total` DECIMAL(10, 2) NOT NULL,
    `detalles` TEXT NULL,

    INDEX `id_pago`(`id_pago`),
    PRIMARY KEY (`id_factura`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HistorialCitas` (
    `id_historial` VARCHAR(191) NOT NULL,
    `id_cita` VARCHAR(191) NOT NULL,
    `fecha_servicio` DATETIME(0) NULL,
    `observaciones` TEXT NULL,

    INDEX `id_cita`(`id_cita`),
    PRIMARY KEY (`id_historial`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mascotas` (
    `id_mascota` VARCHAR(191) NOT NULL,
    `id_usuario` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(50) NOT NULL,
    `especie` VARCHAR(50) NOT NULL,
    `raza` VARCHAR(50) NULL,
    `edad` INTEGER NULL,
    `notas_medicas` TEXT NULL,
    `fecha_registro` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `id_usuario`(`id_usuario`),
    PRIMARY KEY (`id_mascota`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mensajes` (
    `id_mensaje` VARCHAR(191) NOT NULL,
    `id_usuario_envia` VARCHAR(191) NOT NULL,
    `id_usuario_recibe` VARCHAR(191) NOT NULL,
    `contenido` TEXT NOT NULL,
    `fecha_envio` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `leido` BOOLEAN NULL DEFAULT false,

    INDEX `id_usuario_envia`(`id_usuario_envia`),
    INDEX `id_usuario_recibe`(`id_usuario_recibe`),
    PRIMARY KEY (`id_mensaje`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notificaciones` (
    `id_notificacion` VARCHAR(191) NOT NULL,
    `id_usuario` VARCHAR(191) NOT NULL,
    `tipo` ENUM('recordatorio_cita', 'promocion', 'informacion') NOT NULL,
    `mensaje` TEXT NOT NULL,
    `fecha_envio` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `leido` BOOLEAN NULL DEFAULT false,

    INDEX `id_usuario`(`id_usuario`),
    PRIMARY KEY (`id_notificacion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pagos` (
    `id_pago` VARCHAR(191) NOT NULL,
    `id_usuario` VARCHAR(191) NOT NULL,
    `id_cita` VARCHAR(191) NULL,
    `monto` DECIMAL(10, 2) NOT NULL,
    `fecha_pago` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `metodo_pago` ENUM('tarjeta_credito', 'tarjeta_debito', 'transferencia', 'efectivo') NOT NULL,
    `estado` ENUM('completado', 'pendiente', 'cancelado') NULL DEFAULT 'pendiente',

    INDEX `id_cita`(`id_cita`),
    INDEX `id_usuario`(`id_usuario`),
    PRIMARY KEY (`id_pago`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Servicios` (
    `id_servicio` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` TEXT NULL,
    `precio` DECIMAL(10, 2) NOT NULL,
    `duracion` INTEGER NULL,
    `recomendaciones` TEXT NULL,

    PRIMARY KEY (`id_servicio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usuarios` (
    `id_usuario` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `telefono` VARCHAR(20) NULL,
    `direccion` VARCHAR(255) NULL,
    `fecha_creacion` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `ultima_actualizacion` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Citas` ADD CONSTRAINT `Citas_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `Usuarios`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Citas` ADD CONSTRAINT `Citas_id_mascota_fkey` FOREIGN KEY (`id_mascota`) REFERENCES `Mascotas`(`id_mascota`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Citas` ADD CONSTRAINT `Citas_id_servicio_fkey` FOREIGN KEY (`id_servicio`) REFERENCES `Servicios`(`id_servicio`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Facturas` ADD CONSTRAINT `Facturas_id_pago_fkey` FOREIGN KEY (`id_pago`) REFERENCES `Pagos`(`id_pago`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HistorialCitas` ADD CONSTRAINT `HistorialCitas_id_cita_fkey` FOREIGN KEY (`id_cita`) REFERENCES `Citas`(`id_cita`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mascotas` ADD CONSTRAINT `Mascotas_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `Usuarios`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mensajes` ADD CONSTRAINT `Mensajes_id_usuario_envia_fkey` FOREIGN KEY (`id_usuario_envia`) REFERENCES `Usuarios`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mensajes` ADD CONSTRAINT `Mensajes_id_usuario_recibe_fkey` FOREIGN KEY (`id_usuario_recibe`) REFERENCES `Usuarios`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notificaciones` ADD CONSTRAINT `Notificaciones_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `Usuarios`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pagos` ADD CONSTRAINT `Pagos_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `Usuarios`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pagos` ADD CONSTRAINT `Pagos_id_cita_fkey` FOREIGN KEY (`id_cita`) REFERENCES `Citas`(`id_cita`) ON DELETE SET NULL ON UPDATE CASCADE;

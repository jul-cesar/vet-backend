import { PrismaClient, UsuarioRol, notificaciones_tipo, pagos_metodo_pago, citas_estado, disponibilidad_estado, pagos_estado } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Crear Usuarios
  const usuario1 = await prisma.usuarios.create({
    data: {
      nombre: "Juan Perez",
      email: "juan@example.com",
      password: "hashed_password",
      telefono: "123456789",
      rol: UsuarioRol.cliente,
    },
  });

  const usuario2 = await prisma.usuarios.create({
    data: {
      nombre: "Dr. Ana Rodriguez",
      email: "ana@example.com",
      password: "hashed_password",
      telefono: "987654321",
      rol: UsuarioRol.doctor,
    },
  });

  // Crear Servicios
  const servicio1 = await prisma.servicios.create({
    data: {
      nombre: "Consulta General",
      img: "https://example.com/consulta.jpg",
      descripcion: "Consulta para revisión general de la salud de la mascota",
      precio: 20000,
      duracion: 30,
      doctores: { connect: { id_usuario: usuario2.id_usuario } },
    },
  });

  const servicio2 = await prisma.servicios.create({
    data: {
      nombre: "Vacunación",
      img: "https://example.com/vacunacion.jpg",
      descripcion: "Aplicación de vacunas esenciales",
      precio: 30000,
      duracion: 20,
      doctores: { connect: { id_usuario: usuario2.id_usuario } },
    },
  });

  // Crear Mascotas
  const mascota1 = await prisma.mascotas.create({
    data: {
      nombre: "Firulais",
      especie: "Perro",
      raza: "Labrador",
      edad: 5,
      notas_medicas: "Alérgico a algunos alimentos",
      usuario: { connect: { id_usuario: usuario1.id_usuario } },
    },
  });

  // Crear DisponibilidadServicio
  const disponibilidad1 = await prisma.disponibilidadServicio.create({
    data: {
      fecha: new Date('2024-12-01T10:00:00Z'),
      estado: disponibilidad_estado.disponible,
      servicio: { connect: { id_servicio: servicio1.id_servicio } },
    },
  });

  const disponibilidad2 = await prisma.disponibilidadServicio.create({
    data: {
      fecha: new Date('2024-12-01T11:00:00Z'),
      estado: disponibilidad_estado.disponible,
      servicio: { connect: { id_servicio: servicio2.id_servicio } },
    },
  });

  // Crear Citas
  await prisma.citas.create({
    data: {
      id_usuario: usuario1.id_usuario,
      id_mascota: mascota1.id_mascota,
      id_servicio: servicio1.id_servicio,
      id_disponibilidad: disponibilidad1.id_disponibilidad,
      descripcion: "Primera consulta de Firulais",
      estado: citas_estado.programada,
      fecha_creacion: new Date(),
    },
  });

  // Crear Pagos
  const pago1 = await prisma.pagos.create({
    data: {
      id_usuario: usuario1.id_usuario,
      monto: 20000,
      metodo_pago: pagos_metodo_pago.tarjeta_credito,
      estado: pagos_estado.completado,
      fecha_pago: new Date(),
    },
  });

  // Crear Facturas
  await prisma.facturas.create({
    data: {
      id_pago: pago1.id_pago,
      fecha_emision: new Date(),
      monto_total: 20000,
      detalles: "Consulta General",
    },
  });

  // Crear Notificaciones
  await prisma.notificaciones.create({
    data: {
      id_usuario: usuario1.id_usuario,
      tipo: notificaciones_tipo.recordatorio_cita,
      mensaje: "Recuerde su cita para el 01 de diciembre.",
      fecha_envio: new Date(),
      leido: false,
    },
  });

  console.log("Datos iniciales insertados correctamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

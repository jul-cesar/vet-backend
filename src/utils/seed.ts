import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. Crear Doctores
  const doctor1 = await prisma.usuarios.create({
    data: {
      nombre: 'Dr. Juan Pérez',
      email: 'juan.perez@veterinaria.com',
      password: 'password123',
      telefono: '555-1234',
      rol: 'doctor',
      serviciosDoctores: {
        create: [
          {
            nombre: 'Consulta General',
            descripcion: 'Consulta básica para revisión general de la salud de la mascota.',
            precio: 20.00,
            duracion: 30,
            img: 'https://www.veterinariadomicilio.cl/wp-content/uploads/2016/10/cirugias-animales-3.jpg'
          },
          {
            nombre: 'Vacunación',
            descripcion: 'Aplicación de vacunas esenciales para prevenir enfermedades.',
            precio: 30.00,
            duracion: 20,
            img: 'https://site.ucdb.br/public/textos/1024130-hospital-veterinario-ucbd.jpg'
          }
        ]
      }
    }
  });

  const doctor2 = await prisma.usuarios.create({
    data: {
      nombre: 'Dra. María López',
      email: 'maria.lopez@veterinaria.com',
      password: 'password123',
      telefono: '555-5678',
      rol: 'doctor',
      serviciosDoctores: {
        create: [
          {
            nombre: 'Desparasitación',
            descripcion: 'Tratamiento para eliminar parásitos internos y externos.',
            precio: 15.00,
            duracion: 15,
            img: 'https://www.lavanguardia.com/files/og_thumbnail/uploads/2019/10/25/5fa52ef8267ad.jpeg'
          },
          {
            nombre: 'Cirugía Menor',
            descripcion: 'Procedimientos quirúrgicos menores con recuperación rápida.',
            precio: 150.00,
            duracion: 120,
            img: 'https://veterinaria.cayetano.edu.pe/wp-content/uploads/sites/22/2022/09/dia-de-practica-5-819x1024.jpg'
          }
        ]
      }
    }
  });

  // 2. Crear Clientes
  const cliente1 = await prisma.usuarios.create({
    data: {
      nombre: 'Carlos Fernández',
      email: 'carlos.fernandez@correo.com',
      password: 'password123',
      telefono: '555-9876',
      rol: 'cliente'
    }
  });

  const cliente2 = await prisma.usuarios.create({
    data: {
      nombre: 'Laura Martínez',
      email: 'laura.martinez@correo.com',
      password: 'password123',
      telefono: '555-5432',
      rol: 'cliente'
    }
  });

  // 3. Crear Mascotas
  const mascota1 = await prisma.mascotas.create({
    data: {
      nombre: 'Firulais',
      especie: 'Perro',
      raza: 'Labrador',
      edad: 5,
      id_usuario: cliente1.id_usuario
    }
  });

  const mascota2 = await prisma.mascotas.create({
    data: {
      nombre: 'Michi',
      especie: 'Gato',
      raza: 'Siames',
      edad: 3,
      id_usuario: cliente2.id_usuario
    }
  });

  // 4. Crear Servicios Independientes (opcional)
  const servicioConsulta = await prisma.servicios.create({
    data: {
      nombre: 'Consulta Especializada',
      descripcion: 'Consulta para diagnósticos y tratamientos específicos.',
      precio: 50.00,
      duracion: 45,
      img: 'https://i0.wp.com/planetamascotaperu.com/wp-content/uploads/2023/01/desparasitar-perros.webp?fit=960%2C540&ssl=1'
    }
  });

  // 5. Crear Citas
  const cita1 = await prisma.citas.create({
    data: {
      id_usuario: cliente1.id_usuario,
      id_mascota: mascota1.id_mascota,
      id_servicio: servicioConsulta.id_servicio,
      fecha_hora: new Date('2023-12-01T10:00:00Z'),
      descripcion: 'Chequeo general de Firulais para evaluar su estado de salud y actualizar su cartilla de vacunación.',
      estado: 'programada',
      fecha_creacion: new Date()
    }
  });

  const cita2 = await prisma.citas.create({
    data: {
      id_usuario: cliente2.id_usuario,
      id_mascota: mascota2.id_mascota,
      id_servicio: servicioConsulta.id_servicio,
      fecha_hora: new Date('2023-12-02T14:00:00Z'),
      descripcion: 'Revisión de Michi debido a pérdida de apetito y comportamiento inusual.',
      estado: 'programada',
      fecha_creacion: new Date()
    }
  });

  // 6. Crear Pagos
  const pago1 = await prisma.pagos.create({
    data: {
      id_usuario: cliente1.id_usuario,
      id_cita: cita1.id_cita,
      monto: 20.00,
      metodo_pago: 'tarjeta_credito',
      estado: 'completado',
      fecha_pago: new Date()
    }
  });

  const pago2 = await prisma.pagos.create({
    data: {
      id_usuario: cliente2.id_usuario,
      id_cita: cita2.id_cita,
      monto: 50.00,
      metodo_pago: 'efectivo',
      estado: 'pendiente',
      fecha_pago: new Date()
    }
  });

  // 7. Crear Facturas
  await prisma.facturas.create({
    data: {
      id_pago: pago1.id_pago,
      monto_total: 20.00,
      detalles: 'Consulta general de Firulais realizada el 01 de diciembre de 2023.'
    }
  });

  await prisma.facturas.create({
    data: {
      id_pago: pago2.id_pago,
      monto_total: 50.00,
      detalles: 'Consulta especializada de Michi programada para el 02 de diciembre de 2023.'
    }
  });
}

main()
  .then(() => {
    console.log('Base de datos inicializada correctamente.');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient, disponibilidad_estado } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Crear servicios realistas con precios en COP y duraciones en minutos
  const serviciosData = [
    {
      nombre: 'Consulta General',
      img: 'https://example.com/img/consulta_general.png',
      descripcion: 'Revisión médica general para mascotas.',
      precio: 50000, // COP
      duracion: 30, // minutos
      recomendaciones: 'Traer a la mascota en ayunas si es posible.',
    },
    {
      nombre: 'Vacunación',
      img: 'https://example.com/img/vacunacion.png',
      descripcion: 'Aplicación de vacunas según el calendario de la mascota.',
      precio: 45000, // COP
      duracion: 20, // minutos
      recomendaciones: 'Traer el carnet de vacunación previo.',
    },
    {
      nombre: 'Desparasitación',
      img: 'https://example.com/img/desparasitacion.png',
      descripcion: 'Tratamiento preventivo contra parásitos internos y externos.',
      precio: 30000, // COP
      duracion: 15, // minutos
      recomendaciones: 'Consultar si la mascota tiene síntomas antes del procedimiento.',
    },
    {
      nombre: 'Peluquería Canina',
      img: 'https://example.com/img/peluqueria_canina.png',
      descripcion: 'Servicio de baño, corte y peinado para perros.',
      precio: 80000, // COP
      duracion: 60, // minutos
      recomendaciones: 'Informar sobre posibles alergias antes del servicio.',
    },
    {
      nombre: 'Consulta Especializada',
      img: 'https://example.com/img/consulta_especializada.png',
      descripcion: 'Consulta con un veterinario especialista.',
      precio: 100000, // COP
      duracion: 45, // minutos
      recomendaciones: 'Presentar el historial médico de la mascota.',
    },
    {
      nombre: 'Cirugía Menor',
      img: 'https://example.com/img/cirugia_menor.png',
      descripcion: 'Procedimientos quirúrgicos menores para mascotas.',
      precio: 250000, // COP
      duracion: 120, // minutos
      recomendaciones: 'Ayuno obligatorio de al menos 8 horas.',
    },
    {
      nombre: 'Radiografía',
      img: 'https://example.com/img/radiografia.png',
      descripcion: 'Estudios de imagen para diagnóstico.',
      precio: 70000, // COP
      duracion: 30, // minutos
      recomendaciones: 'Evitar movimientos bruscos durante el procedimiento.',
    },
    {
      nombre: 'Limpieza Dental',
      img: 'https://example.com/img/limpieza_dental.png',
      descripcion: 'Higiene bucal profesional para mascotas.',
      precio: 120000, // COP
      duracion: 60, // minutos
      recomendaciones: 'Ayuno previo de 6 horas.',
    },
    {
      nombre: 'Ecografía',
      img: 'https://example.com/img/ecografia.png',
      descripcion: 'Estudio de ultrasonido para diagnóstico interno.',
      precio: 90000, // COP
      duracion: 40, // minutos
      recomendaciones: 'No se requiere preparación previa.',
    },
    {
      nombre: 'Control Postoperatorio',
      img: 'https://example.com/img/control_postoperatorio.png',
      descripcion: 'Revisión y seguimiento después de una cirugía.',
      precio: 40000, // COP
      duracion: 20, // minutos
      recomendaciones: 'Llevar todos los medicamentos indicados.',
    },
  ];

  // Insertar servicios y guardar sus IDs
  const servicios = await Promise.all(
    serviciosData.map((servicio) =>
      prisma.servicios.create({
        data: servicio,
      })
    )
  );

  console.log(`${servicios.length} servicios creados.`);

  // Crear disponibilidades usando los IDs reales de los servicios
  const disponibilidades = [];
  const horarios = [9, 11, 14]; // Horarios estándar: 9 AM, 11 AM, y 2 PM
  const fechaBase = new Date(); // Fecha inicial

  for (const servicio of servicios) {
    for (let dia = 0; dia < 3; dia++) {
      const fecha = new Date(fechaBase);
      fecha.setDate(fecha.getDate() + dia); // Incrementar días

      for (const hora of horarios) {
        const disponibilidadFecha = new Date(fecha);
        disponibilidadFecha.setHours(hora, 0, 0, 0); // Establecer hora exacta

        disponibilidades.push({
          id_servicio: servicio.id_servicio,
          fecha: disponibilidadFecha.toISOString(), // Fecha en formato ISO
          estado: disponibilidad_estado.disponible,
        });
      }
    }
  }

  // Insertar disponibilidades en la base de datos
  await prisma.disponibilidadServicio.createMany({
    data: disponibilidades,
  });

  console.log(`${disponibilidades.length} disponibilidades creadas.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

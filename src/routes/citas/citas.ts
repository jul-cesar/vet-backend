import { Hono } from "hono";
import type { Variables } from "../../index.js";
import { citasValidator, type Cita } from "./validator.js";
import { handlePrismaError } from "../../utils/prismaErrorHandle.js";

export const Citas = new Hono<{ Variables: Variables }>();

Citas.post("/", citasValidator, async (c) => {
  try {
    const prisma = c.get("prisma");
    const {
      estado,
      id_disponibilidad,
      id_mascota,
      id_servicio,
      id_usuario,
      descripcion,
    } = await c.req.json<Cita>();

    const [servicioExist, usuarioExists, mascotaExists, disponibilidadExist] =
      await Promise.all([
        prisma.servicios.findUnique({
          where: {
            id_servicio,
          },
        }),
        prisma.usuarios.findUnique({
          where: {
            id_usuario,
          },
        }),
        prisma.mascotas.findUnique({
          where: {
            id_mascota,
          },
        }),
        prisma.disponibilidadServicio.findUnique({
          where: {
            id_disponibilidad,
          },
        }),
      ]);

    if (!servicioExist) {
      return c.json({ message: "El servicio no existe" }, 404);
    }
    if (!usuarioExists) {
      return c.json({ message: "El usuario no existe" }, 404);
    }
    if (!mascotaExists) {
      return c.json({ message: "La mascota no existe" }, 404);
    }

    const newCita = await prisma.citas.create({
      data: {
        estado,
        id_disponibilidad,
        id_mascota,
        id_servicio,
        id_usuario,
        descripcion,
      },
    });

    await prisma.notificaciones.create({
      data: {
        mensaje: `Tu cita al servicio ${servicioExist.nombre} ha sido apartada exitosamente, con fecha ${disponibilidadExist?.fecha}`,
        tipo: "informacion",
        id_usuario,
      },
    });

    await prisma.disponibilidadServicio.update({
      where: {
        id_disponibilidad,
      },
      data: {
        estado: "reservado",
      },
    });

    return c.json({ message: "Cita apartada con exito", data: newCita }, 201);
  } catch (error) {
    const prismaError = handlePrismaError(error);
    console.error("Error creating service:", prismaError);

    return c.json(
      {
        message: "Error al crear la cita",
        error: prismaError,
      },
      500
    );
  }
});

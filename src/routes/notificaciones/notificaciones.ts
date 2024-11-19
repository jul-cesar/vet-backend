import { Hono } from "hono";
import type { Variables } from "../../index.js";
import { notificacionesValidator, type Notificacion } from "./validator.js";
import { handlePrismaError } from "../../utils/prismaErrorHandle.js";

export const Notificaciones = new Hono<{ Variables: Variables }>();

Notificaciones.post("/", notificacionesValidator, async (c) => {
  try {
    const prisma = c.get("prisma");
    const {
      fecha_envio,

      id_usuario,
      leido,
      mensaje,
      tipo,
    } = await c.req.json<Notificacion>();

    const usuarioExists = prisma.usuarios.findUnique({
      where: {
        id_usuario,
      },
    });

    if (!usuarioExists) {
      return c.json({ message: "El usuario no existe" }, 404);
    }

    const newNoti = await prisma.notificaciones.create({
      data: {
        mensaje,
        tipo,
        fecha_envio,
        id_usuario,
        leido,
      },
    });

    return c.json({ message: "Cita apartada con exito", data: newNoti }, 201);
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

Notificaciones.get("/:id", async (c) => {
  try {
    const prisma = c.get("prisma");
    const idUser = c.req.param("id");

    const userExists = await prisma.usuarios.findUnique({
      where: {
        id_usuario: idUser,
      },
      
      
    });
    if (!userExists) {
      return c.json({ message: "Usuario no existente" }, 404);
    }
    const notis = await prisma.notificaciones.findMany({
      orderBy: {
        fecha_envio: "desc"
      },
      where: {
        id_usuario: idUser,
      },
    });

    return c.json(notis);
  } catch (error) {
    return c.json(
      {
        message: "Error interno del servidor al obtener servicios",
      },
      500
    );
  }
});

import { Hono } from "hono";
import type { Variables } from "../../index.js";
import { mascotasValidator, type Mascota } from "./validator.js";
import { handlePrismaError } from "../../utils/prismaErrorHandle.js";

export const Mascotas = new Hono<{ Variables: Variables }>();

Mascotas.get("/:id", async (c) => {
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
    const mascotas = await prisma.mascotas.findMany({
      where: {
        id_usuario: idUser,
      },
    });

    return c.json(mascotas);
  } catch (error) {
    return c.json(
      {
        message: "Error interno del servidor al obtener servicios",
      },
      500
    );
  }
});

Mascotas.get("/info/:id", async (c) => {
  try {
    const prisma = c.get("prisma");
    const idMascota = c.req.param("id");

    const mascota = await prisma.mascotas.findUnique({
      where: {
        id_mascota: idMascota,
      },
    });
    if (!mascota) {
      return c.json({ message: "Mascota no existente" }, 404);
    }

    return c.json(mascota);
  } catch (error) {
    return c.json(
      {
        message: "Error interno del servidor al obtener servicios",
      },
      500
    );
  }
});

Mascotas.post("/", mascotasValidator, async (c) => {
  try {
    const prisma = c.get("prisma");
    const body = await c.req.json<Mascota>();

    const { especie, nombre, edad, id_usuario, notas_medicas, raza } = body;
    console.log(especie, nombre, edad, id_usuario, notas_medicas, raza)

    const mascotaCreated = await prisma.mascotas.create({
      data: {
        nombre,
        especie,
        edad,
        id_usuario,
        notas_medicas,
        raza,
      },
    });
    await prisma.notificaciones.create({
      data: {
        mensaje: `Tu mascota ${nombre}, ha sido agregada a tu lista de mascotas correctammente}`,
        tipo: "informacion",
        id_usuario,
      },
    });

    return c.json(
      {
        message: "Mascota agregada exitosamente",
        data: mascotaCreated,
      },
      201
    );
  } catch (error) {
    const prismaError = handlePrismaError(error);
    console.error("Error creating service:", prismaError);

    return c.json(
      {
        message: "Error al crear el servicio",
        error: prismaError,
      },
      500
    );
  }
});

Mascotas.put("/:id", mascotasValidator, async (c) => {
  try {
    const prisma = c.get("prisma");
    const body = await c.req.json<Mascota>();
    const id = c.req.param("id");

    const { especie, nombre, edad, id_usuario, notas_medicas, raza } = body;

    const mascotaCreated = await prisma.mascotas.update({
      where: {
        id_mascota: id,
      },
      data: {
        nombre,
        especie,
        edad,
        id_usuario,
        notas_medicas,
        raza,
      },
    });
    await prisma.notificaciones.create({
      data: {
        mensaje: `Tu mascota ${nombre}, ha sido agregada a tu lista de mascotas correctammente}`,
        tipo: "informacion",
        id_usuario,
      },
    });

    return c.json(
      {
        message: "Mascota agregada exitosamente",
        data: mascotaCreated,
      },
      201
    );
  } catch (error) {
    const prismaError = handlePrismaError(error);
    console.error("Error creating service:", prismaError);

    return c.json(
      {
        message: "Error al crear el servicio",
        error: prismaError,
      },
      500
    );
  }
});

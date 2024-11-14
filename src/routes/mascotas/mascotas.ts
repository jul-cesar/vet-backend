import { Hono } from "hono";
import type { Variables } from "../../index.js";

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

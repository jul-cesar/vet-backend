import { Hono } from "hono";
import type { Variables } from "../../index.js";

export const Disponibilidades = new Hono<{ Variables: Variables }>();

Disponibilidades.get("/:id", async (c) => {
  try {
    const prisma = c.get("prisma");
    const idServicio = c.req.param("id");
    const servicioExists = await prisma.servicios.findUnique({
      where: {
        id_servicio: idServicio,
      },
    });

    if (!servicioExists) {
      return c.json({ message: "Servicio no existente" }, 404);
    }
    const dispos = await prisma.disponibilidadServicio.findMany({
      where: {
        AND: [{ id_servicio: idServicio }, { estado: "disponible" }],
      },
    });
    return c.json(dispos);
  } catch (error) {
    return c.json(
      {
        message: "Error interno del servidor al obtener servicios",
      },
      500
    );
  }
});

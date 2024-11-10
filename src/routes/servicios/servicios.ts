import { Hono } from "hono";
import { servciosValidator, type Servicio } from "./validator.js";
import { handlePrismaError } from "../../utils/prismaErrorHandle.js";
import type { Variables } from "../../index.js";

export const Servicios = new Hono<{ Variables: Variables }>();

// GET /servicios
Servicios.get("/", async (c) => {
  try {
    const prisma = c.get("prisma");
    const servicios = await prisma.servicios.findMany();

    return c.json(servicios);
  } catch (error) {
    console.error("Error fetching services:", error);
    return c.json(
      {
        message: "Error interno del servidor al obtener servicios",
      },
      500
    );
  }
});

Servicios.post("/", servciosValidator, async (c) => {
  try {
    const prisma = c.get("prisma");
    const body = await c.req.json<Servicio>();

    const { descripcion, duracion, nombre, precio, recomendaciones } = body;

    const serviceCreated = await prisma.servicios.create({
      data: {
        nombre,
        precio,
        descripcion,
        duracion,
        recomendaciones,
      },
    });

    return c.json(
      {
        message: "Servicio creado exitosamente",
        data: serviceCreated,
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

// Opcional: GET /servicios/:id
Servicios.get("/:id", async (c) => {
  try {
    const prisma = c.get("prisma");
    const id = c.req.param("id");

    const servicio = await prisma.servicios.findUnique({
      where: { id_servicio: id },
    });

    if (!servicio) {
      return c.json({ message: "Servicio no encontrado" }, 404);
    }

    return c.json(servicio);
  } catch (error) {
    const prismaError = handlePrismaError(error);
    console.error("Error getting the service:", prismaError);

    return c.json(
      {
        message: "Error al obtener el servicio",
        error: prismaError,
      },
      500
    );
  }
});

Servicios.delete("/:id", async (c) => {
  try {
    const prisma = c.get("prisma");
    const id = c.req.param("id");

    const serviceExist = await prisma.servicios.findUnique({
      where: {
        id_servicio: id,
      },
    });

    if (!serviceExist) {
      return c.json(
        { message: "El servicio que intentas eliminar no existe" },
        404
      );
    }

    await prisma.servicios.delete({
      where: {
        id_servicio: id,
      },
    });
    return c.json({ message: "Servicio eliminado correctamente" });
  } catch (error) {
    const prismaError = handlePrismaError(error);
    console.error("Error deleting service:", prismaError);

    return c.json(
      {
        message: "Error al eliminar el servicio",
        error: prismaError,
      },
      500
    );
  }
});

Servicios.put("/:id", servciosValidator, async (c) => {
  try {
    const prisma = c.get("prisma");
    const id = c.req.param("id");
    const data = await c.req.json();

    const serviceExist = await prisma.servicios.findUnique({
      where: {
        id_servicio: id,
      },
    });

    if (!serviceExist) {
      return c.json(
        { message: "El servicio que intentas actualizar no existe" },
        404
      );
    }

    const servicioUpdated = await prisma.servicios.update({
      where: {
        id_servicio: id,
      },
      data,
    });

    return c.json({
      message: "Servicio creado exitosamente",
      data: servicioUpdated,
    });
  } catch (error) {}
});

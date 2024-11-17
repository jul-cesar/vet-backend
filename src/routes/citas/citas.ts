import { Hono } from "hono";
import type { Variables } from "../../index.js";
import { citasValidator, type Cita, type CitaPago } from "./validator.js";
import { handlePrismaError } from "../../utils/prismaErrorHandle.js";
import { Decimal } from "@prisma/client/runtime/library";

export const Citas = new Hono<{ Variables: Variables }>();

Citas.get("/:id", async (c) => {
  try {
    const prisma = c.get("prisma");
    const idUser = c.req.param("id");
    const userExist = await prisma.usuarios.findUnique({
      where: {
        id_usuario: idUser,
      },
    });
    if (!userExist) {
      return c.json(
        { message: "El usuario del que intentas obtener sus citas no existe" },
        404
      );
    }

    const citas = await prisma.citas.findMany({
      where: {
        id_usuario: idUser,
      },
    });
    return c.json(citas);
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
      metodo_pago,
      monto,
    } = await c.req.json<CitaPago>();
    const montoDecimal = new Decimal(monto).toNumber();

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

    const servicio = await prisma.disponibilidadServicio.update({
      where: {
        id_disponibilidad,
      },
      data: {
        estado: "reservado",
      },
    });
    const pago = await prisma.pagos.create({
      data: {
        metodo_pago: "tarjeta_credito",
        monto: montoDecimal,
        id_cita: newCita.id_cita,
        id_usuario,
      },
    });

    await prisma.facturas.create({
      data: {
        id_pago: pago.id_pago,
        monto_total: pago.monto,
      },
    });

    return c.json({ message: "Cita apartada con exito", data: newCita }, 201);
  } catch (error) {
    const prismaError = handlePrismaError(error);
    console.error("Error creating cita:", prismaError);

    return c.json(
      {
        message: "Error al crear la cita",
        error: prismaError,
      },
      500
    );
  }
});

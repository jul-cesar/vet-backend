import { zValidator } from "@hono/zod-validator";
import { citas_estado, pagos_metodo_pago } from "@prisma/client";
import { z } from "zod";

const CitasSchema = z.object({
  id_usuario: z.string().cuid(),
  id_mascota: z.string().cuid(),
  id_servicio: z.string().cuid(),
  id_disponibilidad: z.string().cuid(),

  descripcion: z
    .string()
    .max(500, { message: "La descripción no debe exceder los 500 caracteres." })
    .optional(),
  estado: z.nativeEnum(citas_estado).default(citas_estado.programada),
});

export type Cita = z.infer<typeof CitasSchema>;
export type CitaPago = Cita & {
  metodo_pago: pagos_metodo_pago
  monto: number
}

export const citasValidator = zValidator("json", CitasSchema, (result, c) => {
  if (!result.success) {
    const errorMessages = result.error.errors.map((error) => ({
      field: error.path[0],
      message: error.message,
    }));
    return c.json({ messages: errorMessages }, 400);
  }
});

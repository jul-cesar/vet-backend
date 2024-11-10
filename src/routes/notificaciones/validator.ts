import { zValidator } from "@hono/zod-validator";
import { notificaciones_tipo } from "@prisma/client";
import { z } from "zod";

const notificacionesSchema = z.object({
  id_notificacion: z.string().cuid(),
  id_usuario: z.string(),
  tipo: z.nativeEnum(notificaciones_tipo, {
    errorMap: () => ({ message: "Tipo de notificación no válido." }),
  }),
  mensaje: z
    .string()
    .min(1, { message: "El mensaje no puede estar vacío." }),
  fecha_envio: z.date().optional().default(new Date()),
  leido: z.boolean().optional().default(false),
});

type Notificacion  = z.infer<typeof notificacionesSchema>


export const notificacionesValidator = zValidator(
  "json",
  notificacionesSchema,
  (result, c) => {
    if (!result.success) {
      const errorMessages = result.error.errors.map((error) => ({
        field: error.path[0],
        message: error.message,
      }));
      return c.json({ messages: errorMessages }, 400);
    }
  }
);

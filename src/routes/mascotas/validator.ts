import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const mascotasSchema = z.object({
  id_usuario: z.string(),
  nombre: z
    .string()
    .min(1, { message: "El nombre de la mascota es obligatorio." })
    .max(50, { message: "El nombre no debe exceder los 50 caracteres." }),
  especie: z
    .string()
    .min(1, { message: "La especie de la mascota es obligatoria." })
    .max(50, { message: "La especie no debe exceder los 50 caracteres." }),
  raza: z
    .string()
    .max(50, { message: "La raza no debe exceder los 50 caracteres." })
    .optional(),
  edad: z
    .number()
    .int({ message: "La edad debe ser un número entero." })
    .positive({ message: "La edad debe ser un número positivo." })
    .optional(),
  notas_medicas: z
    .string()
    .max(500, { message: "Las notas médicas no deben exceder los 500 caracteres." })
    .optional(),
  fecha_registro: z.date().optional().default(new Date()),
});

export type Mascota = z.infer<typeof mascotasSchema>;



export const mascotasValidator = zValidator(
  "json",
  mascotasSchema,
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


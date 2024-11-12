import { zValidator } from "@hono/zod-validator";
import { Decimal } from "@prisma/client/runtime/library";
import { z } from "zod";



const serviciosSchema = z.object({
  nombre: z
    .string()
    .min(3, {
      message: "El nombre del servicio debe contener al menos 3 caracteres.",
    })
    .max(100, {
      message: "El nombre del servicio no debe exceder los 100 caracteres.",
    }),

  descripcion: z
    .string()
    .min(20, {
      message:
        "La descripción del servicio debe contener al menos 20 caracteres.",
    })
    .optional(),
  img: z.string().min(10, {
    message:
      "La url de la imagen del servicio debe contener al menos 20 caracteres.",
  }),
   precio: z
    .string()
    .regex(/^\d+(\.\d{1,3})?$/, {
      message: "El precio debe tener hasta 3 decimales.",
    })
    .refine((val) => parseFloat(val) >= 10000, {
      message: "El valor del servicio debe ser de al menos 10,000 pesos Colombianos.",
    })
    .transform((val) => new Decimal(val)),  // Convierte a Decimal

  duracion: z
    .number()
    .int({
      message: "La duración del servicio debe ser un número entero en minutos.",
    })
    .min(10, {
      message: "La duración del servicio debe ser de al menos 10 minutos.",
    })
    .optional(),

  recomendaciones: z
    .string()
    .min(10, {
      message: "Las recomendaciones deben tener al menos 10 caracteres.",
    })
    .optional(),
});

export type Servicio = z.infer<typeof serviciosSchema>;

export const servciosValidator = zValidator(
  "json",
  serviciosSchema,
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

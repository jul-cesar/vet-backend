import { zValidator } from "@hono/zod-validator";
import { pagos_estado, pagos_metodo_pago } from "@prisma/client";
import { z } from "zod";

const pagosSchema = z.object({
  id_usuario: z.string(),
  monto: z
    .number()
    .positive()
    .transform((val) => parseFloat(val.toFixed(3))), // Decimal con 3 decimales de precisión
  metodo_pago: z.nativeEnum(pagos_metodo_pago), // Enum para el método de pago
  estado: z.nativeEnum(pagos_estado).default("pendiente"), // Estado con valor por defecto "pendiente"
});

export type Pago = z.infer<typeof pagosSchema>;

export const pagosValidator = zValidator(
  "json",
  pagosSchema,
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

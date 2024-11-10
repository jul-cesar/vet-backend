import { z } from "zod";

const facturasSchema = z.object({
  id_pago: z.string(),
  monto_total: z
    .number()
    .positive({ message: "El monto total debe ser un número positivo." })
    .refine((val) => parseFloat(val.toFixed(2)) === val, {
      message: "El monto total debe tener hasta 2 decimales.",
    }),
  detalles: z
    .string()
    .max(500, { message: "Los detalles no deben exceder los 500 caracteres." })
    .optional(),
});

type Factura = z.infer<typeof facturasSchema>;

import { citas_estado } from "@prisma/client";
import { z } from "zod";

const CitasSchema = z.object({
  id_usuario: z.string().cuid(),
  id_mascota: z.string().cuid(),
  id_servicio: z.string().cuid(),
  fecha_hora: z.date({ 
    required_error: "La fecha y hora de la cita son obligatorias." 
  }),
  descripcion: z
    .string()
    .max(500, { message: "La descripción no debe exceder los 500 caracteres." })
    .optional(),
  estado: z.nativeEnum(citas_estado).default(citas_estado.programada),
});

type Cita = z.infer<typeof CitasSchema>;
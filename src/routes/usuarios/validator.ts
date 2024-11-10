import { zValidator } from "@hono/zod-validator"
import { z } from "zod"

const UsuarioSchema = z.object({
    nombre: z
    .string()
    .min(3, { message: "Por favor ingresa un nombre de al menos 3 caracteres." })
    .max(100, { message: "El nombre no debe exceder los 100 caracteres." }),
  
  email: z
    .string()
    .email({ message: "Por favor ingresa un correo electrónico válido." })
    .max(100, { message: "El correo electrónico no debe exceder los 100 caracteres." }),
  
  password: z
    .string()
    .min(8, { message: "Por favor ingresa una contraseña de al menos 8 caracteres." })
    .regex(/(?=.*[A-Za-z])(?=.*\d)/, { 
      message: "La contraseña debe incluir al menos una letra y un número." 
    })
    .max(255, { message: "La contraseña no debe exceder los 255 caracteres." }),
  
  telefono: z
    .string()
   
    .refine(
      (value) => /^[+]{1}(?:[0-9-()/.]\s?){6,15}[0-9]{1}$/.test(value ?? ""),
      { message: "Por favor ingresa un número de teléfono válido, con el código del país." }
    ).optional(),
  
})

export type User = z.infer<typeof UsuarioSchema>

export const userValidator = zValidator("json", UsuarioSchema, (result, c) => {
  if (!result.success) {
    const errorMessages = result.error.errors.map(error => ({field: error.path[0], message: error.message}))
    return c.json({ messages: errorMessages }, 400)
  }
})
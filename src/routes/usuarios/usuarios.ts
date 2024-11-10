import { Hono } from "hono";
import { userValidator, type User } from "./validator.js";
import type { z } from "zod";

export const Usuarios =  new Hono()

Usuarios.get('/', async (c) => {
   return c.json({user: "Jul"})
})

Usuarios.post('/', userValidator, async(c)=>{
    const body = await c.req.json<User>()
    return c.json(body)
})
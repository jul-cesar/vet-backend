import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { Usuarios } from "./routes/usuarios/usuarios.js";
import { logger } from "hono/logger";
import { Servicios } from "./routes/servicios/servicios.js";
import { PrismaClient } from "@prisma/client";
import { Auth } from "./routes/auth/auth.js";
import { jwt } from "hono/jwt";
import { Mascotas } from "./routes/mascotas/mascotas.js";
import { Disponibilidades } from "./routes/disponibilidades/disponibilidades.js";
import { Citas } from "./routes/citas/citas.js";
import { Notificaciones } from "./routes/notificaciones/notificaciones.js";

export type Variables = {
  prisma: PrismaClient;
};

const prisma = new PrismaClient();
const app = new Hono<{ Variables: Variables }>().basePath("/api");
const JWT_SECRET = process.env.JWT_SECRET || "";

const rutasPublicas = ["/api/auth/register", "/api/auth/login"];

app.use("*", async (c, next) => {
  c.set("prisma", prisma);
  await next();
});
app.use("*", async (c, next) => {
  if (rutasPublicas.includes(c.req.path)) {
    await next();
  } else {
    return jwt({ secret: JWT_SECRET })(c, next);
  }
});
app.use(logger());

app.route("/users", Usuarios);
app.route("/servicios", Servicios);
app.route("/auth", Auth);
app.route("/mascotas", Mascotas);
app.route("/dispos", Disponibilidades);
app.route("/citas", Citas);
app.route("/notificaciones", Notificaciones);

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});

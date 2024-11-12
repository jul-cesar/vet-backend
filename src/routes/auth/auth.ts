import { Hono } from "hono";
import { userValidator, type User } from "../usuarios/validator.js";
import type { Variables } from "../../index.js";
import bcrypt from "bcrypt";
import { handlePrismaError } from "../../utils/prismaErrorHandle.js";
import { sign } from "hono/jwt";

export const Auth = new Hono<{ Variables: Variables }>();

Auth.post("/register", userValidator, async (c) => {
  try {
    const { email, nombre, password, telefono } = await c.req.json<User>();
    const prisma = c.get("prisma");

    const userExist = await prisma.usuarios.findUnique({
      where: { email },
    });

    if (userExist) {
      return c.json({ message: "Ya existe un usuario con este email" }, 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userRegistered = await prisma.usuarios.create({
      data: { email, nombre, password: hashedPassword, telefono },
      select: {
        id_usuario: true,
        email: true,
        nombre: true,
      },
    });
    return c.json({ message: "Registro exitoso", data: userRegistered }, 201);
  } catch (error) {
    const prismaError = handlePrismaError(error);
    console.error("Error creating user:", prismaError);

    return c.json(
      { message: "Error al registrar el usuario", error: prismaError },
      500
    );
  }
});

Auth.post("/login", async (c) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return c.json({ message: "JWT_SECRET no configurado" }, 500);
    }

    const { email, password } = await c.req.json<{
      email: string;
      password: string;
    }>();

    if (!email || !password) {
      return c.json({ message: "Email o contraseña incorrecto" }, 401);
    }
    const prisma = c.get("prisma");
    const userExist = await prisma.usuarios.findUnique({
      where: { email },
    });

    if (!userExist) {
      return c.json({ message: "Email o contraseña incorrecto" }, 401);
    }

    const isValidPassword = await bcrypt.compare(password, userExist.password);

    if (!isValidPassword) {
      return c.json({ message: "Email o contraseña incorrecto" }, 401);
    }

    const token = await sign(
      {
        userId: userExist.id_usuario,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      },
      JWT_SECRET,
      "HS256"
    );
    return c.json(
      {
        message: "Inicio de sesión exitoso",
        token,
        data: {
          id_usuario: userExist.id_usuario,
          nombre: userExist.nombre,
          email: userExist.email,
        },
      },
      200
    );
  } catch (error) {
    console.error(error);
    return c.json({ message: "Hubo un error al iniciar sesión" }, 500);
  }
});

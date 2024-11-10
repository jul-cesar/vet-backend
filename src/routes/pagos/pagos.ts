import { Hono } from "hono";
import type { Variables } from "../../index.js";

const Pagos = new Hono<{Variables: Variables}>()

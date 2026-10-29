import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import errorHandler from "./middlewares/errorHandler";
import notFoundHandler from "./middlewares/notFound";

import authRoutes from "./modules/auth/router";
import usersRoutes from "./modules/users/router";

import statsRoutes from "./modules/stats/router";

const app = express();

/*
 * CORS
 */
app.use(
  cors({
    origin: ["http://localhost:5173", "http://192.168.0.3:5173"],
    credentials: true,
  }),
);

/*
 * Body parser
 */
app.use(express.json());

/*
 * Cookie parser
 */
app.use(cookieParser());

/*
 * Routes
 */

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/stats", statsRoutes);

/*
 * 404
 */
app.use(notFoundHandler);

/*
 * Global error handler
 */
app.use(errorHandler);

export default app;

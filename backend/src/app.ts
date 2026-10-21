import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import errorHandler from "./middlewares/errorHandler";
import notFoundHandler from "./middlewares/notFound";

import authRoutes from "./modules/auth/router";
// import userRoutes from "./modules/user/router";
import workbookRoutes from "./modules/workbook/router";
import sheetRoutes from "./modules/sheet/router";

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
// app.use("/api/user", userRoutes);
app.use("/api/workbooks", workbookRoutes);
app.use("/api/sheets", sheetRoutes);

/*
 * 404
 */
app.use(notFoundHandler);

/*
 * Global error handler
 */
app.use(errorHandler);

export default app;

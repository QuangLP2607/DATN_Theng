import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import errorHandler from "./middlewares/errorHandler";
import notFoundHandler from "./middlewares/notFound";

// Routes
import authRoutes from "./modules/auth/router";
import usersRoutes from "./modules/users/router";
import subjectRoutes from "./modules/subject/router";
import classRoutes from "./modules/class/router";
import examRoutes from "./modules/exam/router";
import questionRoutes from "./modules/question/router";
import lessonRoutes from "./modules/lesson/router";
import assignmentRoutes from "./modules/assignment/router";
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
app.use("/api/subjects", subjectRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/assignments", assignmentRoutes);
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

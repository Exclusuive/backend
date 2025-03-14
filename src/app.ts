import express, { Application, Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../build/swagger-output.json";

dotenv.config();

const app: Application = express();

app.set("port", 8080);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Use User Routes
app.use("/users", userRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("🔥 Error:", err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

app.listen(app.get("port"), () => {
  console.log(`🚀 Server running on port ${app.get("port")}`);
});

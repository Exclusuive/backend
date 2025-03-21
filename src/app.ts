import express, { Application, Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import collectionRoutes from "./routes/collectionRoutes";

import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

dotenv.config();

const app: Application = express();

app.set("port", 8080);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Swagger YAML Setup
const swaggerPath = path.join(__dirname, "./swagger/swagger.yaml");
const swaggerDocument = YAML.load(swaggerPath);

// Use Routes
app.use("/users", userRoutes);
app.use("/collections", collectionRoutes);
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

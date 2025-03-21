import express, { Application, Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import collectionRoutes from "./routes/collectionRoutes";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import axios from "axios";

dotenv.config();

const app: Application = express();

app.set("port", 8080);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Swagger YAML Setup
const swaggerPath = path.join(__dirname, "./swagger/swagger.yaml");
const swaggerDocument = YAML.load(swaggerPath);

// Health Check Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

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

// Keep Server Alive by Sending Requests to Itself Every 14 Minutes
const keepServerAlive = () => {
  const url = `http://localhost:${app.get("port")}/`;
  setInterval(async () => {
    try {
      const response = await axios.get(url);
      console.log("🔄 Keep-alive request sent:", response.data);
    } catch (error) {
      console.error("❌ Keep-alive request failed:", error.message);
    }
  }, 10 * 60 * 1000); // 14 minutes in milliseconds
};

app.listen(app.get("port"), () => {
  console.log(`🚀 Server running on port ${app.get("port")}`);
  keepServerAlive(); // Start keep-alive requests
});

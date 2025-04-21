import express, { Application, Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import collectionRoutes from "./routes/collectionRoutes";
import s3Routes from "./routes/s3Routes";
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
// app.use("/users", userRoutes);
app.use("/collections", collectionRoutes);
app.use("/s3", s3Routes);
// app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("🔥 Error:", err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

keepServerAlive();

setInterval(keepServerAlive, 600000);
// Keep Server Alive by Sending Requests to Itself Every 14 Minutes
function keepServerAlive() {
  const now = new Date().toLocaleString(); // 현재 시각 (로컬 시간대 기준)

  const url = `https://backend-iiqs.onrender.com/${app.get("port")}/`;
  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then((data) => console.log(now, "data length:", data.length))
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
} // 10 minutes in milliseconds

app.listen(app.get("port"), () => {
  console.log(`🚀 Server running on port ${app.get("port")}`);
  // keepServerAlive(); // Start keep-alive requests
});

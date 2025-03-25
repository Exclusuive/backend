"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const collectionRoutes_1 = __importDefault(require("./routes/collectionRoutes"));
const s3Routes_1 = __importDefault(require("./routes/s3Routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
dotenv.config();
const app = (0, express_1.default)();
app.set("port", 8080);
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Swagger YAML Setup
const swaggerPath = path_1.default.join(__dirname, "./swagger/swagger.yaml");
const swaggerDocument = yamljs_1.default.load(swaggerPath);
// Health Check Route
app.get("/", (req, res) => {
    res.status(200).json({ status: "ok", message: "Server is running" });
});
// Use Routes
app.use("/users", userRoutes_1.default);
app.use("/collections", collectionRoutes_1.default);
app.use("/s3", s3Routes_1.default);
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
// Global Error Handler
app.use((err, req, res, next) => {
    console.error("🔥 Error:", err);
    res
        .status(err.status || 500)
        .json({ error: err.message || "Internal Server Error" });
});
// Keep Server Alive by Sending Requests to Itself Every 14 Minutes
const keepServerAlive = () => {
    const url = `http://localhost:${app.get("port")}/`;
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(url);
            console.log("🔄 Keep-alive request sent:", response.data);
        }
        catch (error) {
            console.error("❌ Keep-alive request failed:", error.message);
        }
    }), 10 * 60 * 1000); // 14 minutes in milliseconds
};
app.listen(app.get("port"), () => {
    console.log(`🚀 Server running on port ${app.get("port")}`);
    keepServerAlive(); // Start keep-alive requests
});

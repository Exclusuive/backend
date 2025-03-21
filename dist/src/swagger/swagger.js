"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const swaggerGen = (0, swagger_autogen_1.default)();
const doc = {
    info: {
        title: "My API",
        description: "Automatically generated API documentation",
    },
    host: "localhost:8080",
    schemes: ["http"],
    definitions: {
        User: {
            id: "123456",
            email: "user@example.com",
            nickname: "testuser",
            name: "John Doe",
            vegetarian_stage: "Vegan",
        },
    },
    paths: {
        "/users/{id}": {
            get: {
                summary: "Get a user by ID",
                description: "Fetches user details based on their unique ID.",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "The ID of the user.",
                        schema: {
                            type: "string",
                        },
                    },
                ],
            },
        },
    },
};
const outputFile = "build/swagger-output.json";
const endpointsFiles = ["src/app.ts"];
swaggerGen(outputFile, endpointsFiles, doc).then(() => {
    console.log("✅ Swagger documentation generated successfully!");
});

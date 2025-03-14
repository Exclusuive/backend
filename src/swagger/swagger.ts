import swaggerAutogen from "swagger-autogen";

const swaggerGen = swaggerAutogen();

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

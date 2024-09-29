import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Internal Servel API",
      version: "1.0",
      description: "Basic user manage",
    },
  },
  apis: ["./routes/*.js"], // Path to your API routes
};
export const specs = swaggerJSDoc(options);

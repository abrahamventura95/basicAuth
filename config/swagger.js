import swaggerJSDoc from "swagger-jsdoc";

const options = {
  swaggerDefinition: {
    openapi: "3.0.1",
    info: {
      title: "Internal Server API",
      version: "1.0",
      description: "Basic user manage",
    },
    paths: {},
    components: {
      securitySchemes:{
        Bearer: {
          type: "apiKey",
          name: "Authorization",
          in: "header",
          description: "Bearer <JWT>"
        }
      }
    },
  },
  apis: ["./routes/*.js"], // Path to your API routes
};
export const specs = swaggerJSDoc(options);

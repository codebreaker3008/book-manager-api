// swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Book Manager API",
      version: "1.0.0",
      description: "A simple Express API for managing books",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./routes/*.js"], // Ensure your route files have Swagger comments
};

const specs = swaggerJsdoc(options);

function setupSwagger(app) {
  // Swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

  // 🚀 Expose raw JSON for Keploy and tools like Redoc
  app.get("/swagger.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(specs);
  });
}

module.exports = setupSwagger;

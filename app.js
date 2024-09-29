import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { createLogger, transports as _transports } from "winston";
import { config as _config } from "dotenv";
import { connectDB } from "./config/db.js";
import { specs } from "./config/swagger.js";
import swaggerUi from "swagger-ui-express";
import { userRoute } from "./routes/users.js";
_config();

const config = {
  port: process.env.PORT || "3030",
  host: process.env.HOST || "0.0.0.0",
};

const app = express();
connectDB();
app.use(bodyParser.json());
app.use(cors());
const logger = createLogger({
  transports: [new _transports.Console()],
});

app.use("/api/v1", userRoute);
app.use("/", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(config.port, config.host, (e) => {
  if (e) {
    throw new Error("Internal Server Error");
  }
  logger.info(`Server is running on ${config.host}:${config.port}`);
});

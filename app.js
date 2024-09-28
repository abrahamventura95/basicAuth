import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { createLogger, transports as _transports } from "winston";
import { config as _config } from "dotenv";

_config();
const port = process.env.PORT;
const host = process.env.HOST;

const config = {
  name: "base-config",
  port,
  host,
};

const app = express();

app.use(bodyParser.json());
app.use(cors());
const logger = createLogger({
  transports: [new _transports.Console()],
});

app.get("/", (req, res) => {
  res.status(200).send("test");
});

app.listen(config.port, config.host, (e) => {
  if (e) {
    throw new Error("Internal Server Error");
  }
  logger.info(`${config.name} running on ${config.host}:${config.port}`);
});

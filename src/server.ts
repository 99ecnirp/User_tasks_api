import express from "express";
import http from "http";
import connectMongo from "./database/mongo";
import { taskRoutes, userRoutes } from "./routes";
import { SUCCESS } from "./utils/constants";

const router = express();

async function main() {
  await connectMongo();
  router.use((req, res, next) => {
    /** Log the req */
    console.log(
      `Incomming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
    );

    res.on("finish", () => {
      /** Log the res */
      console.log(
        `Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}] -- ${req.params}`
      );
    });

    next();
  });
  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());

  /** Rules of our API */
  router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if (req.method == "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "PUT, POST, PATCH, DELETE, GET"
      );
      return res.status(200).json({});
    }

    next();
  });

  /** Routes */
  router.use('/user', userRoutes);
  router.use('/tasks', taskRoutes);

  /** Healthcheck */
  router.get("/healthcheck", (req, res) =>
    res.status(200).json({
      error: false,
      message: SUCCESS,
    })
  );

  /** Error handling */
  router.use((req, res, next) => {
    const error = new Error("Something went wrong");

    console.log(error);

    res.status(404).json({
      message: error.message,
    });
  });

  http
    .createServer(router)
    .listen(3000, () => console.log(`Server is running on port 3000`));
}

main();

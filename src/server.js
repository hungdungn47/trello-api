/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import express from "express";
import { connectDb } from "~/config/mongodb";
import { env } from "~/config/environment";
import { APIs_V1 } from "~/routes/v1";
import { errorHandlingMiddleware } from "~/middlewares/errorHandlingMiddleware";
import cors from "cors";
import { corsOptions } from "./config/cors";

const startServer = () => {
  const app = express();

  app.use(cors(corsOptions));
  // Enable req.body json data
  app.use(express.json());

  // Use APIs V1
  app.use("/v1", APIs_V1);

  app.use(errorHandlingMiddleware);

  app.get("/", (req, res) => {
    res.end("<h1>Hello World!</h1><hr>");
  });

  if (env.BUILD_MODE === "production") {
    app.listen(process.env.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Production running at port:${process.env.PORT}/`);
    });
  } else {
    app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      // eslint-disable-next-line no-console
      console.log(
        `Server is running at ${env.LOCAL_DEV_APP_HOST}:${env.LOCAL_DEV_APP_PORT}/`
      );
    });
  }
};

connectDb()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Connected to MongoDB localhost server");
  })
  .then(() => {
    startServer();
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(0);
  });

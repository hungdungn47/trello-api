/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import express from "express"
import { connectDb } from "~/config/mongodb"
import { env } from "~/config/environment"
import { APIs_V1 } from "~/routes/v1"
import { errorHandlingMiddleware } from "~/middlewares/errorHandlingMiddleware"
import cors from "cors"
import { corsOptions } from "./config/cors"
import cookieParser from "cookie-parser"
import socketIo from 'socket.io'
import http from 'http'
import { inviteUserToBoardSocket } from "./sockets/inviteUserToBoardSocket"


const startServer = () => {
  const app = express();

  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  app.use(cookieParser())

  app.use(cors(corsOptions));
  // Enable req.body json data
  app.use(express.json());

  // Use APIs V1
  app.use("/v1", APIs_V1);

  app.use(errorHandlingMiddleware);

  const server = http.createServer(app)

  const io = socketIo(server, { cors: corsOptions })
  io.on('connection', inviteUserToBoardSocket)

  app.get("/", (req, res) => {
    res.end("<h1>Hello World!</h1><hr>");
  });

  if (env.BUILD_MODE === "production") {
    server.listen(process.env.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Production running at port:${process.env.PORT}/`);
    });
  } else {
    server.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
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

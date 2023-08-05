import express from "express";
import http from "http";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";

import { PORT } from "./config.js";
import cors from "cors";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

const server = http.createServer(app);
const io = new SocketServer(server, {
  // cors: {
  //   origin: "http://localhost:3000",
  // },
});

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

app.use(express.static(resolve("frontend/dist")));

io.on("connection", (socket) => {
  socket.on("message", (body) => {
    socket.broadcast.emit("message", {
      body,
      from: socket.id.slice(8),
    });
  });
});
app.use(express.static(join(__dirname, "../client/dist")));
server.listen(PORT);
console.log(`server on port ${PORT}`);

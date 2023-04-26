import zmq from "zeromq"; // (1)
import { ZmqMiddlewareManager } from "./zmqMiddlewareManager.js";
import { jsonMiddleware } from "./jsonMiddleware.js";
import { zlibMiddleware } from "./zlibMiddleware.js";

async function main() {
  const socket = new zmq.Request(); // (2)
  await socket.connect("tcp://127.0.0.1:5000");

  const manager = new ZmqMiddlewareManager(socket);
  manager.use(zlibMiddleware);
  manager.use(jsonMiddleware);
  manager.use({
    inbound(message) {
      console.log("Echoed back", message);
      return message;
    },
  });

  setInterval(() => {
    // (2)
    manager
      .send({
        action: "ping",
        echo: Date.now(),
      })
      .catch((err) => console.error(err));
  }, 1000);

  console.log("Client connected");
}

main();

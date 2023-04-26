import zmq from "zeromq"; // (1)
import { jsonMiddleware } from "./jsonMiddleware.js";
import { ZmqMiddlewareManager } from "./zmqMiddlewareManager.js";
import { zlibMiddleware } from "./zlibMiddleware.js";

async function main() {
  const socket = new zmq.Reply(); // (2)
  await socket.bind("tcp://127.0.0.1:5000");

  const manager = new ZmqMiddlewareManager(socket); // (3)
  manager.use(zlibMiddleware());
  manager.use(jsonMiddleware());
  manager.use({
    // (4)
    async inbound(message) {
      console.log("Received", message);
      if (message.action === "ping")
        await this.send({
          action: "ping",
          echo: message.echo,
        });
      return message;
    },
  });

  console.log("Server started.");
}

main();

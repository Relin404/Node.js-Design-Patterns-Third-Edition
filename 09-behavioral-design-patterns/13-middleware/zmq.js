const zmq = require("zeromq");

class ZmqMiddlewareManager {
  constructor(socket) {
    // (1)
    this.socket = socket;
    this.inboundMiddleware = [];
    this.outboundMiddleware = [];

    this.handleIncomingMessages().catch((err) => console.error(err));
  }

  async handleIncomingMessages() {
    // (2)
    for await (const [message] of this.socket) {
      await this.executeMiddleware(this.inboundMiddleware, message).catch(
        (err) => {
          console.error("Error while processing the message", err);
        }
      );
    }
  }

  async send(message) {
    // (3)
    const finalMessage = await this.executeMiddleware(
      this.outboundMiddleware,
      message
    );
    return this.socket.send(finalMessage);
  }

  use(middleware) {
    // (4)
    if (middleware.inbound) this.inboundMiddleware.push(middleware.inbound);
    if (middleware.outbound) this.outboundMiddleware.push(middleware.outbound);
  }

  async executeMiddleware(middlewares, initialMessage) {
    // (5)
    let message = initialMessage;
    for await (const middlewareFunction of middlewares) {
      message = await middlewareFunction.call(this, message);
    }
    return message;
  }
}

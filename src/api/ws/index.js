import { io } from "socket.io-client";
import { wsEndpoint } from "../../../serverConfig";

class WebSocketService {
  static socket = io(wsEndpoint, { autoConnect: false }); // Don't auto-connect yet
  static routes = new Map(); // Stores event handlers
  static lastSendTimes = new Map();
  static messageQueue = []; // Queue for messages sent before connection

  static initialize() {
    if (this.socket.connected) return;

    this.socket.on("connect", () => {
      //console.log("✅ Socket.IO connected");
      this.flushQueue(); // Send queued messages
    });

    this.socket.on("connect_error", (error) => console.error("❌ Socket.IO error:", error));
    this.socket.on("disconnect", (reason) => console.warn("⚠️ Socket.IO disconnected:", reason));

    this.socket.connect(); // Now start connection
  }

  static registerEvent(event, handler) {
    if (!this.routes.has(event)) {
      this.routes.set(event, handler);
      this.socket.on(event, handler);
    }
  }

  static unregisterEvent(event) {
    if (this.routes.has(event)) {
      this.socket.off(event, this.routes.get(event));
      this.routes.delete(event);
    }
  }

  static send(method, payload) {
    const now = Date.now();
    const lastSendTime = this.lastSendTimes.get(method) || 0;

    if (this.socket.connected) {
      if (now - lastSendTime < 200) {
        //console.log("⏳ Throttled:", method.toUpperCase());
        return;
      }
      console.log(method.toUpperCase(), "=>", payload)
      this.socket.emit("message", {method, payload});
      console.info("📤 Sent:", method.toUpperCase());
      this.lastSendTimes.set(method, now);
    } else {
      console.warn("⚠️ Socket not connected, queuing:", method.toUpperCase());
      this.messageQueue.push({ method, payload }); // Queue message
      this.initialize(); // Ensure connection starts
    }
  }

  static flushQueue() {
    while (this.messageQueue.length > 0) {
      const { method, payload } = this.messageQueue.shift();
      this.send(method, payload);
    }
  }

  static close() {
    if (!this.socket) return;
    //console.log("🛑 Closing WebSocket");
    this.socket.disconnect();
  }
}

export default WebSocketService;

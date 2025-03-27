import { wsEndpoint } from "../../../serverConfig";

class WebSocketService {
  static socket = null;
  static routes = new Map(); // Stores route handlers
  static isManuallyClosed = false;
  static reconnectInterval = 5000; // 5 seconds
  
  static lastSendTimes = new Map();

  static ensureInitialized() {
    if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
      this.initialize();
    }
  }

  static initialize() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) return;

    this.isManuallyClosed = false;
    this.socket = new WebSocket(API_WS_URL);

    this.socket.onopen = () => console.log("WebSocket connection opened");
    this.socket.onerror = (error) => console.error("WebSocket error:", error);

    this.socket.onmessage = (event) => {
      try {
        const { method, payload } = JSON.parse(event.data);
        if (this.routes.has(method)) {
          this.routes.get(method)(payload);
        } else {
          console.warn(`No handler registered for method: ${method}`);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    this.socket.onclose = (event) => {
      console.warn("WebSocket closed:", event.reason);
      if (!this.isManuallyClosed) {
        console.log(`Reconnecting in ${this.reconnectInterval / 1000} seconds...`);
        setTimeout(() => this.initialize(), this.reconnectInterval);
      }
    };
  }


  static send(method, payload) {
    this.ensureInitialized();
    const now = new Date().getTime();
    const lastSendTime = this.lastSendTimes.get(method) || 0;

    if (this.socket.readyState === WebSocket.OPEN) {
      if (now - lastSendTime < 2000) {
        console.log("xxxxx - ", method.toUpperCase(), "throttled: ", now, lastSendTime)
        return;
      }

      console.log("======= - ", method.toUpperCase(), "passed")
      this.socket.send(JSON.stringify({ method, payload }));
      this.lastSendTimes.set(method, now); // Update last send time for this method
    } else {
      console.warn("WebSocket is not open. Message not sent:", { method, payload });
    }
  }

  

  static route(method, handler) {
    this.ensureInitialized();
    this.routes.set(method, handler);
  }

  static removeRoute(method) {
    this.routes.delete(method);
  }

  static close() {
    if (!this) return
    this.isManuallyClosed = true;
    if (this?.socket) {
      console.log("socket about to close")
      this.socket.close();
    }
  }
}

export default WebSocketService;

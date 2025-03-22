
import { API_WS_URL } from "../../../serverConfig"

let socket = null

const initializeWebSocketConn = () => {
    const socket = new WebSocket(API_WS_URL);
    socket.onopen = () => console.log("WebSocket connection opened");
    socket.onerror = (error) => console.error("WebSocket error:", error);
    return socket;
  }

const getWebSocketConn = () => {
    return socket;
};

export { initializeWebSocketConn, getWebSocketConn }

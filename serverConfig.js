// serverConfig.js
const servers = import.meta.env
const API_BASE_URL = "http://localhost:3500/api/v1" //servers[servers.VITE_API_BASE_URL] || servers.VITE_SERVER_1
const API_WS_URL = servers.VITE_WS_SERVER

export default API_BASE_URL;

export { API_WS_URL }

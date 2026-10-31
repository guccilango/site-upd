// Configure the backend API URL hosted on bot-hosting.net (or local server).
// When running on the same origin as FastAPI, window.location.origin is used automatically.
window.UPD_CONFIG = {
  API_URL:
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? window.location.origin
      : (localStorage.getItem("upd_api_url") || "https://your-server.apps.bot-hosting.cloud"),
  DEPARTMENT_NAME: "Unified Police Department",
  JURISDICTION: "State of San Andreas · County of Los Santos",
};

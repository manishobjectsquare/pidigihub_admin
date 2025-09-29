let baseUrl = "";

const hostname = window.location.hostname;

if (hostname.includes("pidigihub.in")) {
  baseUrl = "https://api.pidigihub.in";
} else if (hostname.includes("pidigihub.objectsquare.in")) {
  baseUrl = "https://apipidigihub.objectsquare.in";
} else {
  // baseUrl = "https://apipidigihub.objectsquare.in";
  baseUrl = "https://api.pidigihub.in";
  // baseUrl = "http://localhost:7002";
}

// baseUrl = "http://localhost:7002";
export { baseUrl };

const apiUrl =
  process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";

export default apiUrl;
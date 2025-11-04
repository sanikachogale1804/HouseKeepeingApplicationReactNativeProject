// const isDevelopment = process.env.NODE_ENV === "development";
const Api_link = (() => {
  const hostname = window.location.hostname;

  if (hostname === "localhost") return "https://localhost:5005"; 
  if (hostname === "192.168.1.92") return "https://192.168.1.92:5005";
  // deployment: use full URL with port
  return "https://45.115.186.228:5005";
})();
export default Api_link;

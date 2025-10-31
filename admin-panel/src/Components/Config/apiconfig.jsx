const isDevelopment = process.env.NODE_ENV === "development";

// For local development many backends run without TLS. Use http for dev URLs
// Keep production URL as https. If your backend supports TLS locally, change
// these to https:// or set an environment variable to force HTTPS.
const EMULATOR_URL = "http://10.0.2.2:5005";   
const LOCALHOST_URL = "http://localhost:5005"; 
const LOCAL_IP_URL = "http://192.168.1.92:5005"; 
const PROD_URL = "https://45.115.186.228:5005";  

let Api_link;

if (isDevelopment) {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    if (hostname === "localhost") {
      Api_link = LOCALHOST_URL;
    } else if (hostname.startsWith("192.168.")) {
      Api_link = LOCAL_IP_URL;
    } else {
      Api_link = EMULATOR_URL;
    }
  } else {
    Api_link = EMULATOR_URL;
  }
} else {
  Api_link = PROD_URL;
}

export default Api_link;

const isDevelopment = process.env.NODE_ENV === "development";

const EMULATOR_URL = "http://10.0.2.2:5005";   
const LOCALHOST_URL = "http://localhost:5005"; 
const LOCAL_IP_URL = "http://192.168.1.92:5005"; 
const PROD_URL = "http://45.115.186.228:5005";  

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
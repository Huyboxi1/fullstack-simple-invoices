import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";

const proxyHost = "160.250.183.167";
const proxyPort = 24178;
const proxyUser = "muaproxy68f1cf78cf738";
const proxyPass = "olneqwxouadslyx5";

// build proxy URL with basic auth
const proxyUrl = `http://${encodeURIComponent(proxyUser)}:${encodeURIComponent(
  proxyPass
)}@${proxyHost}:${proxyPort}`;

// Create agents for HTTP and HTTPS (use both to be safe)
const httpsAgent = new HttpsProxyAgent(proxyUrl);
const httpAgent = new HttpsProxyAgent(proxyUrl); // HttpsProxyAgent works for HTTP targets too

export const axiosInstance = axios.create({
  httpAgent,
  httpsAgent,
  proxy: false, // important: tell axios not to use its built-in proxy option
  timeout: 15_000 // optional: fail fast if proxy is dead
});

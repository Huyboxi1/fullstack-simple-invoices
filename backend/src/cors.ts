import { BadRequestException, HttpStatus } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

const isDynamicLocalhostAllowed = (
  requestOrigin: string,
  whitelistArray: string[]
) => {
  const regLocalhost = /http:\/\/localhost:?\d*/g;
  const localhostDynamicPorts = "http://localhost:*";
  return (
    regLocalhost.test(requestOrigin) &&
    whitelistArray.indexOf(localhostDynamicPorts) >= 0
  );
};

const isSubdomainHost = (requestOrigin: string, subdomainRegex: string) => {
  console.log(
    "In isSubdomainHost, subdomainRegex =>",
    subdomainRegex,
    "requestOrigin",
    requestOrigin
  );
  if (!subdomainRegex) {
    return false;
  }
  const regex = new RegExp(subdomainRegex);
  const matches = regex.exec(requestOrigin);
  console.log("In isSubdomainHost, matches?.groups =>", matches?.groups);
  return !!matches;
};

type CallbackType = (err: Error | null, allow?: boolean) => void;
type CorsType = (requestOrigin: string, callback: CallbackType) => void;

export const origin = (configService: ConfigService<any>): CorsType => {
  return (requestOrigin: string, callback: CallbackType) => {
    const whitelists = configService.get<string>("WHITELISTS", "").trim();
    const subdomainRegex = configService
      .get<string>("SUBDOMAIN_REGEX", "")
      .trim();
    const whitelistArray = whitelists.split(",");

    if (
      !requestOrigin ||
      whitelists === "*" ||
      isDynamicLocalhostAllowed(requestOrigin, whitelistArray) ||
      isSubdomainHost(requestOrigin, subdomainRegex) ||
      whitelistArray.indexOf(requestOrigin) >= 0
    ) {
      return callback(null, true);
    }

    const error = {
      message: `No CORS allowed. Origin: ${requestOrigin}`,
      statusCode: HttpStatus.BAD_REQUEST
    };
    return callback(new BadRequestException(error), false);
  };
};

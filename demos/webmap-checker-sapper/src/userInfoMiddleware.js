import { getSelf } from "@esri/arcgis-rest-request";
import { getUser } from "@esri/arcgis-rest-users";

// this middleare checks for a session and if we find a session add
// additional info to that session from the getUser and getSelf calls
// request here is the incoming request in express.
export function userInfoMiddleware(incomingRequest, outgoingResponse, next) {
  if (incomingRequest.session && incomingRequest.session.userSession) {
    Promise.all([
      getUser({ authentication: incomingRequest.session.userSession }),
      getSelf({ authentication: incomingRequest.session.userSession })
    ]).then(([userInfo, orgInfo]) => {
      // add information to the request so the next middleware can access it
      incomingRequest.session.userInfo = userInfo;
      incomingRequest.session.orgInfo = orgInfo;
      next(); // run the next middleware
    });
  } else {
    next(); // run the next middleware
  }
}

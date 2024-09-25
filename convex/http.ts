import { httpRouter } from "convex/server";
import { auth } from "./auth";


/**This small code snippet is provided by Convex and includes the ability to directly route users
 * to a set and defined web location - either internal or external - when a certain action is performed.
 * this is used commonly for Auth procedures using OAuth providers - allowing your user to be redirected to a
 * confirmation page within that provider's domain to confirm or deny the access request before returning to the 
 * web app and continuing as a logged-in user.
 */
const http = httpRouter();

auth.addHttpRoutes(http);

export default http;

/**This file is what's known as a 'middleware' and as such, is software run somewhere between the front end
 * and back end. This is commonly used for routing with Authorization, allowing for, as seen below, protection
 * of data on pages that should only be seen by a user with an account with proper permissions, or for drawing
 * users who are already logged in or registered away from the pages used to do that, preventing excess session
 * creation or multiple users being created by the same person. convexAuthNextjsMiddleware() is a method that
 * accepts a callback function, pulling in the url request (the url typed into the browser's link bar or the external
 * link that has been clicked) and verifying that the person should be on that page based on a set list of variables.
 * All variables used in this method should be middleware-approved information, and as such should hold no client-side
 * or directly server-side data, only holding information that has already been called and received by the server directly
 * before this call. Middleware is run almost constantly, so routing is done here for complex spaces such as 
 * Auth calls that allow for external providers to be used in sign-in or registration. */
import { convexAuthNextjsMiddleware, 
        createRouteMatcher, 
        isAuthenticatedNextjs,
        nextjsMiddlewareRedirect } from "@convex-dev/auth/nextjs/server";
  

/**createRouteMatcher is a middleware function that creates a route with the app's home domain followed by the string
 * entered within the array. Adding more data to this array allows for defining a series of pages, and the variable 
 * it is assigned to works the same as hardcoding this url in its entirety, but with the safety of allowing for the
 * function to work even when the domain changes without having to rewrite values. */        
const isPublicPage = createRouteMatcher(['/auth']);
 


export default convexAuthNextjsMiddleware((request) => {
    /** Within our Middleware function, we use any data defined above in order to check the current situation against
     * a defined state that we wish to be true before acting upon it. 
     *  In this case, our first condition detailed below
     * will only activate if the page requested is NOT included within the isPublicPage variable created above AND the 
     * client does NOT have an active user session on the browser that is attempting to access that page. Then we use 
     * nextjsMiddlewareRedirect - a function that is called before anything on a loading page mounts - to change
     * the page that is loading as well as the address named in the url bar to be that of our auth page - one that is on
     * the list of 'public' pages defined above as well as the best location for someone to be able to proceed with our
     * site.
     *  Conversely, below that, we check the exact opposite - we want to make sure that a user who is logged in does not
     * have access to the 'login/register' page, and check to see if the browser making the request is requesting the
     * login/signup page AND that the browser has a client session active at the time. If both of these are true, the
     * router then redirects that user away from the sign-in page and to the home page instead - both ensuring them they
     * are properly signed in and preventing them from overloading the database with new user or login requests.*/
    if (!isPublicPage(request) && !isAuthenticatedNextjs()) {
      return nextjsMiddlewareRedirect(request, '/auth')
    }

    if(isPublicPage(request) && isAuthenticatedNextjs()) {
      return nextjsMiddlewareRedirect(request, '/');
    }
});
 
export const config = {
  // The following matcher runs middleware on all routes
  // except static assets. It is auto-generated and copy-pasted in from Convex directly.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
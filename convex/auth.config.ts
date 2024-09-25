/**This file is another provided by Convex that simply tells the web app where to look for information needed to complete
 * the Authentication process, including Connection urls, Client hashes, and Client Secrets - an alphanumeric passcode that
 * is kept hidden from the user, but is passed back to the database as a sort of password to allow that user access to the
 * creation or access into a user account or other informational table.
 */
export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL,
      applicationID: "convex",
    },
  ],
};

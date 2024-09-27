import { useQuery } from 'convex/react'

import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'

/**Interface here is used as an object that defines how we'll interact with this code from external calls. Inside, we
 * pass the names we wish to use for our parameters - as descriptive as possible - and attach them to the required type
 * of their value - A practice called 'type safety', which prevents errors from such things as giving a number to a
 * function that then tries to interact with it as a string, or such other effect. Here, we give our parameter the 
 * required type of 'Id<'workspaces'>', which is functionally identical to the value given in our API as 
 * 'v.id('workspaces')'.
 */
interface UseGetChannelsProps {
    workspaceId: Id<'workspaces'>
}
 
/**Being a pseudo-hook, the function will take parameters within an object instead of an array, but will still have 
 * the convention of beginning with the word 'use', allowing the reader of our code to understand that we're using 
 * this function to effectively 'hook into' our API and perform the actions here within a single line of code elsewhere.
 */
export const useGetChannels = ({
    workspaceId
}: UseGetChannelsProps) => {
    /**We assign two variables here, the first being our data pulled from the API, and the second a boolean to inform
     * whether the data has finished loading or not. 
     * 
     * The data variable is collected using the useQuery React hook, passing in the path to our query method and an 
     * object containing the args required by that method. Though our channels.ts file is inside of a directory called
     * 'convex', it is specifically an api query, and so it is recorded in the api file of 'convex/_generated', allowing
     * us to call it as an extension of that file. We then further extend that with the name of the method we're using - 
     * in this case, we have only the 'get' method, so we target that, as there is no default for method targets, and
     * leaving the mehthod out of this call will force an error because the codebase doesn't know what it's looking for.
     * 
     * The isLoading variable then checks that data for a proper value, as the api call takes time. This returns a true
     * value while the data is being fetched, but a false once the data value actually holds information. Doing this 
     * allows us to use such things as skeleton loading states rather than leaving a blank page for the user to stare
     * at during loading, also informing the user that there is indeed something happening behind the scenes and they
     * do not need to refresh or retry their action, and the site is not broken.
     */
    const data = useQuery(api.channels.get, { workspaceId });
    const isLoading = data === undefined;

    /**In order to return both variables in a useable state, we return them as an object, shorthanding a self-defining
     * property for each, thus when we destructure these values out of our initialization in relevant files, we can
     * directly use them for whatever purpose we wish rather than having to use dot notation and remember exactly what
     * is useable in what context.
     */
    return { data, isLoading }
}
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"

/**this pseudo-hook is an api call that simply asks the API to check the current session and return the value of the
 * current user's user data so we can then use that as information in later files. This includes things like the user's
 * userId, their userName, profile image, email, encrypted password, and other such values.
 *  In addition, we also are exporting an 'isLoading' value, so we can implement a skeleton loading state anywhere
 * the user's information would be used while we wait for it to load in from the API call.
 */
export const useCurrentUser = () => {
    const data = useQuery(api.users.current);
    const isLoading = data === undefined;

    return { data, isLoading };
}
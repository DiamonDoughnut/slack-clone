import { useParams } from "next/navigation";

import { Id } from "../../convex/_generated/dataModel";

/**Similar to React Hooks such as useState or useEffect, this exported function allows us to call a certain type of
 * effect within any other part of our site, and is therefore a server-side action. Here, our useWorkspaceId is set
 * up to accept any number of parameters, and the useParams() is a Nextjs hook that allows the code to read the info
 * from the url of a dynamic page - for example, our [workspaces] page. In an example case, if we were to search for
 * and access a workspace with the workspaceId of '123321' by using the dynamic url of 
 * 'http://www.website.here/workspaces/123321' - if that website then uses the same structure as ours here, the variable
 * would then be set to '123321' as a string (all URLs are string - must parse for numbers if wanted), as that value 
 * is in the URL only because of the '.../workspaces/[workspaceId]' dynamic listing.
 *  Following the access of that information, we use the return the information - given to the variable as an object
 * of - using the number in the section above - { workspaceId: '123321' } - the property being named after the inner-
 * text of the dynamic url, and its value set by the actual requested url, then certify that it is of the type we need
 * later in our other pages with the 'as' keyword, changing the type to Id<'workspaces'> - a unique, self-created type
 * that only accepts information that conforms to the types defined in the space where that type is first defined.
 */
export const useWorkspaceId = () => {
    const params = useParams();

    return params.workspaceId as Id<'workspaces'>
}
 
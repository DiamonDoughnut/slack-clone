import { useMutation } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

type RequestType = { name: string };
/**RequestType and ResponseType are custom built types that we are using to define what is going to be allowed
 * within a database call or query in order for a successful result and will return an error within the code if
 * a request is made incorrectly. Types like this can only be created within non-'use client' files and can only be
 * called within the file they're defined unless properly exported.
 * 
 * The Id type is a unique and volatile advanced typing provided by Convex's data model. This type will create a new, 
 * unique Id string (settings for how this is created are available to look at in Convex's docs) and assign it within
 * the relevant tables to a property of either 'Id' or whatever string is placed within the angle brackets. Allowing
 * the ResponseType to also be null prevents errors from happening unintentionally when a request returns no data or
 * when a request fails, as this would prevent the failed request from giving the proper error for debugging purposes.
 */
type ResponseType = Id<"workspaces"> | null;


/**The Options type defined here allows us to set up a list of parameters to be used within the functions and data
 * defined below. The name of the property within the definition object will be the way to access said information
 * in other pages, and the value on the right will then be the only type of accepted value. This can be a standard 
 * value type, a uniquely defined data type, or an arrow function that accepts all the wanted parameter types and 
 * returns void.
 * 
 * These can then be pulled later within this file to tell it where such function calls should be run during the
 * execution of this file. If the function is stated within the definition of another function, it is then a
 * voluntary piece of that function, and if there's something you wish to run inside of that voluntary function, it
 * must be called within the proper place. See how onSuccess? is defined here and where it is called below within the
 * mutate() function along with how it's used in the create-workspace-modal file.
 */
type Options = {
    onSuccess?: (data: ResponseType) => void;
    onError?: (error: Error) => void;
    onSettled?: () => void; 
    throwError?: boolean;
};


export const useCreateWorkspace = () => {
    const [data, setData] = useState<ResponseType>(null);
    const [error, setError] = useState<Error | null>(null);

    /**the state below is set in a way that it will only accept a certain set of values. this is done by placing 
     * a list of values within angle brackets that are separated by a pipe ('|'). if the state is initially set to
     * a string, for instance, and the list below is defined, it must be set to one of the values within its list, 
     * and can only be changed later on to be one of the listed values, forcing an error if set to something outside
     * this list.
     */
    const [status, setStatus] = useState<'success' | 'pending' | 'error' | 'settled' | null>(null)

    /**useMemo is a React Hook that is used to 'memoize' a value, turning the value of the function's default return
     * into an interactive and responsive variable even when called outside of the file where it is defined. Memoized
     * values are used just like a normal variable, but automatically update their own value when the state of the 
     * state value within its dependency value changes. 
     *  In this function, we export the variables for use in other files as their values will be updated based on their
     * logical function whenever this file's 'status' state variable changes - a fact we address later on, changing the
     * value to represent the state of an API call. This allows for the value of each of these variables to be dynamically
     * altered and update the rest of our site immediately based on this - isPending for the implementation of skeleton
     * loading states, isSuccess for the removal or addition of certain elements, isSettled for elements that should
     * change when there's no API request within a set amount of time, and isError for stating the value and presence
     * of an error within the API calls.
     */
    const isPending = useMemo(() => status === 'pending', [status])
    const isSuccess = useMemo(() => status === 'success', [status])
    const isError = useMemo(() => status === 'error', [status])
    const isSettled = useMemo(() => status === 'settled', [status])

    /**this is a specific function call for Convex's database, calling useMutation - a react hook created specifically
     * for working with Convex. This hook takes a parameter that tells it what to do with the database when its used and
     * allows for React's state-reloading whenever this is used on a database - particularly useful for message apps.
     *  api is a generated file from Convex that pulls and updates itself to match the schema being used by the current
     * database, maintaining said schema as an object, with the different tables listed within as properties that hold their
     * relative docs within their own objects. Calling this with (api.tableName.create) then tells the database that we're
     * going to be creating an entirely new doc rather than editing an existing one, and thus, don't need to search for or
     * access a doc within the table to change.
     */
    const mutation = useMutation(api.workspaces.create);

    const mutate = useCallback(async (values: RequestType, options?: Options) => {
        /**mutate is our name for the function we're creating to do our API work for us. It will use a callback function,
         * this way the function won't be called immediately upon mounting and will only be used specifically when we want
         * for it to. Data within should then ALWAYS be wrapped in a try/catch block and can optionally have a /finally clause
         * as well, if there's functionality you wish to happen after the API call resolves.
         *  In our case here, we use the first three lines to reset our important values to default, preventing data overflow
         * and incorrect early response. We then await the useMutation hook from above, passing in our arguments for the values
         * listed within 'RequestType' at the top of this page, and then ensure that our response from the server fits to the
         * ResponseType defined above as well. 
         *  Options as designed above are called within here to inform them of which values they're to pull from the API 
         * function in order for use when called later, and the ? notation informs the logic that it's not a problem if that 
         * function isn't called in some places. The try block then returns the successful response and the finally block runs
         * immediately after, skipping the catch block unless the API call fails, in which case we have the block return the 
         * error in such a way that we can then catch it within a try/catch block later on in other files. 
         *  Finally, we set the dependency array to include the variable set to the main hook from before, this way the information
         * displayed to the user will change every time that hook is resolved within the API function. 
         */
        try{
            setData(null);
            setError(null);
            setStatus('pending');

            const response = await mutation(values);
            options?.onSuccess?.(response)
            setStatus('success')
            return response;
        } catch (error) {
            options?.onError?.(error as Error);
            
            if(options?.throwError) {
                setStatus('error');
                throw error;
            }
        } finally {
            options?.onSettled?.();
            setStatus('settled')
        }
    }, [mutation]);

    /**our return here will return an object, as we wish to export multiple values, and we don't want to be forced
     * to load all of them anywhere we want to use only one or two of them. This allows us to import each value specifically
     * through a destructuring call, similar to how we would import functions and methods in the imports block. Examples
     * of this can be seen throughout this project for reference.
     */
    return {
        mutate,
        data,
        error,
        isPending,
        isError,
        isSuccess,
        isSettled
    }
}


import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

/**For creating join codes, we use the generateCode function to create a unique, encrypted string that will link
 * to a specific workspace and allow any user who inputs it to join that channel and see its content
 */
const generateCode = () => {
    const code = Array.from(
        { length: 6 }, 
        () => 
            '0123456789abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 36)]
        
    ).join('');

    return code;
}

/*The statement here is a direct API database interaction call that changes or creates a determined document/type on 
the database being used. mutation is a server-side call that directly connects to the database's code and performs
the requested function. All server-api calls are entered as an object with the properties of args and handler.
args contains an object that holds the wanted properties: in this case, Name, which is assigned a variable type. 
'v' is a method-object created and implemented by Convex that translates the given variable into a form that the
server can understand. the handler is a function or method, always async, that takes the parameters of args and 
ctx(or context). Inside the handler is where most of the logic is run, including the actual api call, with 
methods provided directly by Convex, and passing in the context as a parameter. The returned data can be checked
with conditionals, changed with operations, obfuscated in any way wished or deobfuscated, and is then returned as
useable data so that when, in this case, 'create' is called in src files, the data returned can be used as if a full
async/await or fetch().then().then() function had been used. */
export const create = mutation({
    args: {
        name: v.string()
    },
    handler: async (ctx, args) => {

        /**the auth object is the file described by convex/auth.ts, with each exported method being an accessible 
         * 'property', which can then be interacted with as if the method were directly defined in the called file.
         * In this case, we are using the getUserId method that is defined in convex/auth (even though it is marked
         * as depricated, this doesn't mean it is broken - only that they plan to replace it in future versions.) and
         * we are handing it the context in which we call the main request - namely, the session and client information
         * which is kept locally to prevent the user from being forced to log in every time they change pages. 
         */
        const userId = await auth.getUserId(ctx)

        /** in reality, this conditional should never be called or active while a user is working with our program,
         * but it's good practice to include a "just in case" check to make sure that the above api-request returned a 
         * valid and useable result - weirder things have happened. What this does is check that the userId variable 
         * defined by the data retrieved from the database actually exists and the user is not browsing through our 
         * protected pages without being logged in or while their session is expired, throwing an error and, with the
         * 'throw' keyword, exiting the function early without completing the request.
         */
        if(!userId) {
            
            throw new Error('Unauthorized');
        }

        const joinCode = generateCode();

        /** The 'insert' function is part of the database object, and takes 2 parameters: the database table being
         * worked with, and the information that will be added as lines in the created document. Convex makes this 
         * easy, but making the new document read directly as an object, while also making the input args read as an 
         * object, allowing for certain inputs to be accessed via . notation: see name, below. Aside from this, data
         * can be generated in the function here without any user interaction to create a set or directly variable 
         * data entry tied to this doc which can then be read and/or used later when this doc is fetched via a different
         * function.
         */
        const workspaceId = await ctx.db.insert('workspaces', {
            name: args.name,
            userId,
            joinCode
        })

        /**assign the user who creates the database as a member and an admin in relation to the newly created 
         * workspace. This will keep the flow of creation smooth, while allowing for privacy in dm's and workspaces.
         */
        await ctx.db.insert('members', {
            userId,
            workspaceId,
            role: 'admin'
        })

        return workspaceId;
    }
})

/** The 'query' method is similar to the 'mutate' method above, but instead of changing/creating tables within the
 * database, it searches the existing tables for a doc within the named table matching the parameters passed in through
 * the 'args' object. This doesn't require an 'args' input, however, as with this function, we're making a multi-doc 
 * return - a way to collect and return the entire list of docs within the database. This is great for small-size
 * applications, but there should be size limits/access limits placed on calls like this when used on larger apps.
 */
export const get = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);

        /**Because errors can't be caught during a standard query, instead of using a throw new Error call, we simply
         * return an empty array and will handle a redirect later.
         */
        if(!userId) {
            return [];
        }

        /**This code here will modify our search on login to find all workspaces that the user is a member of. To do
         * this, we are searching the db with the schema indexes we created to directly pick the workspace objects 
         * that contain a 'userId' field that matches the currently logged in user.
         */

        const members = await ctx.db.query('members').withIndex('by_user_id', (q) => q.eq('userId', userId)).collect();

        /**Once we have the list of workspace objects tied to a member Id, we need to search through those and return 
         * a list of each of their ids in an array we can use to render those workspaces once we do a bit more work
         */
        const workspaceIds = members.map((member) => member.workspaceId);

        /**We first create an empty array in order to prep our variable for future use within the proper scope, then
         * we use a for loop, iterating over the array by item, not by length, and using a db query to pull the array
         * of renderable workspaces so that when we return that list, the user can't see any workspaces they shouldn't.
         * 
         * The reason we use this type of iteration on the array and not a map, is that making an asynchronous request 
         * is much cleaner when doing it this way - the Promise All method within a .map() call can get very messy if 
         * we need to query more than one thing.
         */
        const workspaces = []

        for (const workspaceId of workspaceIds) {
            const workspace = await ctx.db.get(workspaceId);

            if(workspace) {
                workspaces.push(workspace);
            }
        }

       return await ctx.db.query('workspaces').collect();
    }
})

/**This is our other type of 'query' method call, looking directly through the 'workspaces' table for a doc with a
 * specific workspaceId field. The args are passed in as an object within the app, including only the ones listed
 * in our 'args' object below - this is called a 'scheme'. Our scheme should be defined as 'argName: argType' where 
 * 'argName' is the name of the table column where the data is found in our wanted doc, and the 'argType' is the
 * defined 'type' of the data we're searching for (e.g. string, number, error, et.c.). These types can be built into
 * typescript itself or can be defined in the convex\_generated\api.d.ts file, however, this - being a 'generated' file
 * will compile on its own when the type is used in <> angle brackets elsewhere that it's interacted with by Convex.
 */
export const getById = query({
    args: {id: v.id('workspaces')},
    handler: async(ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if(!userId) {
            
            throw new Error('Unauthorized'); 
            //TODO - change to effective forced redirect to compensate for lagged redirect - or force page reload.
        }

        const member = await ctx.db
            .query('members')
            .withIndex('by_workspace_id_user_id', (q) => 
                q.eq('workspaceId', args.id).eq('userId', userId))
            .unique();

        if(!member) {
            return null
        }

        /**the get() function call is provided by Convex as an alternative to the standard 'query' call, only requiring
         * one arg to be passed in as a standard variable and returning the first doc that's found to match and satisfy
         * the requirement. This is best used when a search is performed for a unique ID attached to the doc, such as, in
         * this case, the workspaceId variable - a hashedString that is generated as a unique instance whenever a new doc 
         * is created. The properties that can be searched in this way are defined in the /convex/schema file or are listed 
         * on the website when using a pre-built schema.
         */
        return await ctx.db.get(args.id);
    }
})

export const update = mutation({
    args: {
        id: v.id('workspaces'),
        name: v.string()
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if(!userId) {
            
            throw new Error('Unauthorized'); 
            //TODO - change to effective forced redirect to compensate for lagged redirect - or force page reload.
        }

        const member = await ctx.db
            .query('members')
            .withIndex('by_workspace_id_user_id', (q) => 
                q.eq('workspaceId', args.id).eq('userId', userId))
            .unique();
            
        if(!member || member.role !== 'admin') {
            throw new Error('Unauthorized');
        }    
        
        /**The .patch() method on the database object provided by Convex is the method used to modify a value within
         * the target doc. It takes two parameters: first the unique Id of the doc you are trying to modify, and 
         * second: an object containing the names of the fields you want to modify as the properties, and the values
         * you want to update those to as their related values.
         */
        await ctx.db.patch(args.id, {
            name: args.name
        })

        return args.id;
    }
})

export const remove = mutation({
    args: {
        id: v.id('workspaces'),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if(!userId) {
            
            throw new Error('Unauthorized'); 
            //TODO - change to effective forced redirect to compensate for lagged redirect - or force page reload.
        }

        const member = await ctx.db
            .query('members')
            .withIndex('by_workspace_id_user_id', (q) => 
                q.eq('workspaceId', args.id).eq('userId', userId))
            .unique();
            
        if(!member || member.role !== 'admin') {
            throw new Error('Unauthorized');
        }    
        
        /**The .delete() method is provided by the Convex database and simply locates the doc associated with the
         * inserted parameter and removes it from the database completely. This, however does not remove associated
         * fields within other tables that aren't related to the database targeted by this api file, so we will need
         * to create an additional method afterwards to deal with that - in this case, deleting the member list for
         * the workspace that's being deleted. This action is called cascading and is a non-default procedure.
         * 
         * The function here will call forward the list of members associated with our workspace targeted for removal,
         * allowing us to then work with that list directly upon deletion. This will help later when we're looking at
         * removing channels and other similar workspace sub-spaces.
         * 
         * The Promise.all() function is the method useable to bring forward an API call with a .map() method attached
         * to an array in direct React Components, and will always return a list of promises. We deal with this by 
         * specifying that our variable that's being assigned to it is within an array, and will therefore be much 
         * easier to work with down the line. The Promise.all() method takes a single parameter, being an array of 
         * API queries - the code for which is simplified for us greatly by Convex's inbuilt code. Because this is an
         * array, cascading database deletes is extremely simple: just pass more queries into the array, separated by
         * a comma, for each entry you wish to delete alongside the target.
         */
        const [members] = await Promise.all([
            ctx.db
              .query('members')
              .withIndex('by_workspace_id', (q) => (
                q.eq('workspaceId', args.id)  
              ))
              .collect()
        ]);

        for(const member of members){
            await ctx.db.delete(member._id);
        }

        await ctx.db.delete(args.id);

        return args.id;
    }
})
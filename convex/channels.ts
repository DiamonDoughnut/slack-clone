import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

/**This, similar to our workspaces.ts, members.ts, and users.ts, is a purpose built query so that we can then add a 
 * pseudo-hook for ease of access. Important to note here, that while this file is required for the ability to call
 * our database and retrieve this information, the pseudo-hook in our features/ directory is entirely optional, and 
 * simply used to improve ease of use, allowing us to assign a variable to the value returned without going through
 * the task of entering the same arguments over and over again throughout our files. Through this file I will explain
 * the use of our different methods once again.
 */ 

/**The 'create' function here is a method provided by Convex that allows for the creation of a new doc within the 
 * Database table 'channels'. It will accept the input of a name for this new channel, so long as this name is unique,
 * as well as automatically pull the workspaceId from the context in which it is being called.
*/
export const create = mutation({
  args: {
    name: v.string(),
    workspaceId: v.id('workspaces')
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)

    /**For this, since it's only going to be called when a user directly wants it to, we can throw an error, as it
     * can be caught.
     */
    if (!userId) {
      throw new Error('Unauthorized');
    }

    /**Here we check the list of members to make sure the user trying to create a new channel is actually a member
     * as well as check that member's role to ensure they have the proper role to create a new channel. If either of
     * these checks fails, we can throw another error here.
     */
    const member = await ctx.db
          .query('members')
          .withIndex('by_workspace_id_user_id',
            (q) => q.eq('workspaceId', args.workspaceId).eq('userId', userId)
          )
          .unique();

    if (!member || member.role !== 'admin') {
      throw new Error('Unauthorized')
    }
     
    /**Only once these checks have completed can the user actually create a new channel, and as an extra layer of name
     * accuracy, we will once again check that the name fits all required parameters, being no white space or capitals.
     * Once this is done, we can then properly add the new channel to our database so that it can be used by all 
     * authorized members.
     */
    const parsedName = args.name
      .replace(/\s+/g, '-')
      .toLowerCase();

    const channelId = ctx.db.insert('channels', {
      name: parsedName,
      workspaceId: args.workspaceId
    })  

    return channelId;
  }
})

/**Our 'get' function is the name we will call when requesting this information from the database, calling for
 * 'channels.get()'. Into that, we will then pass data that matches the types given in our 'args' object: in this
 * example, that will be a database id by the header of 'workspaces'. This is denoted within our other files as
 * Id<'workspaces'>, and here as v.id('workspaces') - the v being a method given by Convex to assist in the translation
 * of typescript types directly to the types used by the database's code.
 */
export const get = query({
    args: {
        workspaceId: v.id('workspaces')
    },
    /* The handler property of our query is an asynchronous function, and must be asynchronous, as it is where the
    call to our API will be made and needs to wait for the response before continuing any of its activity to prevent
    errors from undefined values. The parameters given to this function are the context of where the call is being made
    and who is making it (ctx), and the arguments requested above in order to properly complete the query (args)*/
    handler: async (ctx, args) => {
        /**The first thing we must do is validate that the query is being made within the proper context: in this case
         * the user must be signed in, and the channels we return must belong to workspaces where that user is a member.
         * To do this, first we use our auth database call to verify that the current user (a piece of data given by the
         * context when the call is made) is actively signed in and has a session being recorded on the database. Assigning
         * this data then to a variable will then make that variable either 'undefined' or a string matching the active 
         * user's userId assigned during registration. If that variable is undefined due to either a database error or the
         * user not being signed in, we then return an empty array, refusing to give any data to that user, but also not 
         * throwing an error, as it's not in a place where we can catch said error.
         */
        const userId = await auth.getUserId(ctx)

        if(!userId){
            return []
        }

        /**Next, we will look at the current workspaceId as well as the current userId to return the specific member role
         * of that user that's assigned by the server. This value persists over an entire workspace, so every channel within
         * should be available to a user who is verified to have both. To do this, we query our members object within 
         * schema.ts, using the defined index of 'by_workspace_id_user_id', letting us check the user against the current
         * workspace and not simply returning the member role for ALL workspaces - as this might end up giving a user access
         * to a channel they don't own as an 'admin' - not a function we want to happen accidentally. We then check to ensure
         * the user that is logged in actually has a proper role within the current workspace before giving any data, but in 
         * the case they don't we still do not throw an error for the same reasons as given above.
         */
        const member = await ctx.db
          .query('members')
          .withIndex('by_workspace_id_user_id',
            (q) => q.eq('workspaceId', args.workspaceId).eq('userId', userId)
          )
          .unique();

        if(!member) {
            return []
        }  

        /**Finally, having verified that the user is both logged in and has a proper role within the workspace in question,
         * we ask the API to return a full list of channels within that workspace. The .collect() method returns these as an 
         * array, and we return this array as it's now in a form we can work with in other areas of our code.
         */
        const channels = await ctx.db
          .query('channels')
          .withIndex('by_workspace_id',
            (q) => q.eq('workspaceId', args.workspaceId)
          )
          .collect()

        return channels;  
    }
})

export const getById = query({
    args:{
        id: v.id('channels')
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        
        if (!userId){ 
          return null;
        }
        
        const channel = await ctx.db.get(args.id);

        if (!channel) {
          return null;
        }

        const member = await ctx.db
          .query('members')
          .withIndex('by_workspace_id_user_id', (q) => 
            q.eq('workspaceId', channel.workspaceId)
            .eq('userId', userId)
          )
          .unique();

        if (!member) {
          return null;
        }

        return channel;
    }
});

export const update = mutation({
    args:{
        id: v.id('channels'),
        name: v.string()
    },
    handler: async (ctx, args) => {
      const userId = await auth.getUserId(ctx);
      
      if (!userId) {
          throw new Error('Unauthorized');
      }

      const channel = await ctx.db.get(args.id);

      if(!channel) {
        throw new Error('Channel not Found');
      }
      
      const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) => 
          q.eq('workspaceId', channel.workspaceId).eq('userId', userId))
      .unique();
      
      if(!member || member.role !== 'admin') {
          throw new Error('Unauthorized');
      }  
      
      await ctx.db.patch(args.id, {
        name: args.name
      })

      return args.id;
    }
})

export const remove = mutation({
    args:{
        id: v.id('channels')
    },
    handler: async (ctx, args) => {
      const userId = await auth.getUserId(ctx);
      
      if (!userId) {
          throw new Error('Unauthorized');
      }

      const channel = await ctx.db.get(args.id);

      if(!channel) {
        throw new Error('Channel not Found');
      }
      
      const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) => 
          q.eq('workspaceId', channel.workspaceId).eq('userId', userId))
      .unique();
      
      if(!member || member.role !== 'admin') {
          throw new Error('Unauthorized');
      }  

      const [messages] = await Promise.all([
        ctx.db
          .query('messages')
          .withIndex('by_channel_id', (q) => 
            q.eq('channelId', args.id)
          )
          .collect()
      ]);

      for (const message of messages) {
        await ctx.db.delete(message._id)
      }
      
      await ctx.db.delete(args.id)

      return args.id;
    }
})
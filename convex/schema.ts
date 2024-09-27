import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";


/**Schemas are the way to determine which fields will be included in a set table. In this case, we use the spreader
 * function on the authTables variable so that we can keep the standard authorization procedures while defining other
 * tables in which to keep data. This prevents people from being able to pull unique user Ids and passwords whenever
 * making a request for a doc that was created by a set user - something that would be bad for app security, to say 
 * the least. The name of a table we wish to create will be the property of a new entry in the object given here, with
 * the value being the method of 'defineTable'. As an arg for the method call, we pass another object containing the
 * data and wanted types for the new table. In this case, name is the title of our first section with a required 
 * entry type of 'string', meaning this will not accept a Number or Array type entry, but will convert anything possible
 * into string format before adding it into the table. The same happens with our 'joinCode' entry - something we will
 * use in a similar manner to a Discord 'invite code'. When creating our 'userId' field, we give it a type of 'id('users')', 
 * a unique type we have defined in this case - and thus one that must be directly set to any input data within our code.
 * the 'v' object is provided by Convex in the /values directory, and acts as an intermediary, parsing the input value
 * into a manner that is understandable by the database server. When exporting the schema, we allow ourselves to call this 
 * data structure into other locations which allows us to share this data with other parts of the backend/middleware that
 * may need more clarification for its functions.
 * 
 * Each newly created table can then be modified with one or more .index() methods, passing in two arguments. The first
 * is the string name of the index that we will use within our api calls, and the second is an array of the document
 * headers that it will try to search through for our query - these each being a string for this parameter. This allows
 * us to quite simply build our own query setups, rather than building out a query(where)... method, we can simply
 * add a .withIndex() method call to a standard query, as seen within the workspaces.ts file in this same folder. 
 */
const schema = defineSchema({
  ...authTables,
  workspaces: defineTable({
    name: v.string(),
    userId: v.id('users'),
    joinCode: v.string()
  }),
  members: defineTable({
    userId: v.id('users'),
    workspaceId: v.id('workspaces'),
    role: v.union(v.literal('admin'), v.literal('member'))
  })
    .index('by_user_id', ['userId'])
    .index('by_workspace_id', ['workspaceId'])
    .index('by_workspace_id_user_id', ['workspaceId', 'userId']),
  channels: defineTable({
    name: v.string(),
    workspaceId: v.id('workspaces')
  })
    .index('by_workspace_id', ['workspaceId'])  

});
 
export default schema;
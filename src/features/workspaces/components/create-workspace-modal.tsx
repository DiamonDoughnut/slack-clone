"use client";
/**the 'use client' statement above marks this file to be used on something called the 'server-client' border. This
 * is required for the completion of certain actions and the accessing of certain data from the client's web browser,
 * but also stops the use of certain other actions. This does not mark this page as rendering or acting ONLY on the
 * client, as that would be veritably useless, but does mark that it shouldn't interact too frequently with the server.
 *  When a 'use client' page returns an HTML element that contains direct calls to other pages, it does not force any 
 * of those pages into a 'use client' state, instead worrying less about the values returned and more about the actions
 * performed upon that data. -MORE READING NEEDED TO FULLY UNDERSTAND-
 * 
 * 
 *  In the imports below, the components of 'dialog/et.al., input, and button are from a 'Component Library' called
 * 'ShadCN'. Component libraries are an online, easily accessible list of pre-styled components that can be placed directly
 * into the HTML of a file's return Element and, unless wished, need no extra information to work and -typically- look
 * professional.
 *  Each Component downloads as its own file, not as a node_module, and thus is much easier to interact with and modify, 
 * allowing the dev to go directly into the component's code (usually installed in the base 'components' directory) and 
 * add new styles or modify existing ones, then style the entire component by calling the 'variant' property and giving it
 * the name of the desired format.
 *  Variants and Sizes are just two of the potential properties, and are stored as objects within the component file using
 * tailwindCss as the main styling method and being very easily modifiable. More Information on these components can be found
 * on ShadCn's website within their documentation, along with examples of the components and their functionality.
 */
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'

import { toast } from 'sonner'

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useCreateWorkspace } from '../api/use-create-workspace';

import { useCreateWorkspaceModal } from '../store/use-create-workspace-modal'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const CreateWorkspaceModal = () => {
    /**useRouter is a common react/nextjs function hook that allows for direct routing of a client (changing the currently
     * loaded url on the client's browser without requesting the user do it personally). Here it is being used to direct 
     * the user to an active workspace that they can access, and if there isn't one, instead waiting for the workspace
     * creation process to complete before doing so at that point.
     */
    const router = useRouter();

    /**This is how Jotai's Atoms are accessed and used - placing them directly into the file in the same way one would
     * a useState hook, but without needing to pass in a default value as it's already defined within the creation of 
     * the atom. Using it in this way doesn't offer much in functionality or writability against useState, but greatly
     * improves readibility of the code, allowing the reader to directly and easily understand what the call is doing
     * when useState may be too vague for the current context.
     */
    const [open, setOpen] = useCreateWorkspaceModal();
    const [name, setName] = useState('')

    /**This is a destructuring of a directly created hook that is made to create our workspaces. This hook has a few
     * other properties that are accessible in the same way, but exporting them in this manner allows for the retrieval
     * of only those parts which are needed for the local code. 
     *  In relation here, mutate is a Convex function that allows us to change/create information on the database directly
     * and isPending is a function created by us within the useCreateWorkspace file that only will give a positive
     * response when there has been an API request, but a response has not yet arrived. This is used in our current
     * page to create a skeleton loading state rather than allowing for blank pages to exist visibly.
     */
    const { mutate, isPending } = useCreateWorkspace();

    const handleClose = () => {
        setOpen(false);
        setName('')
        //TODO - Clear form
    }

    /**Our handleSubmit function will have to do API handling, and thus needs to be async, and since it will be
     * receiving information from a form within the page, it will be given a parameter of e or 'event'. In TS,
     * we need to clarify then that this is a FormEvent from an HTML element, ensuring that our later functions
     * that work with this data don't attempt to use it in a way that breaks the logic of the site. In addition to
     * this, we need to preventDefault on the event, so as to stop it from submitting a blank form or whatever
     * values we set for it to default to, as that would defeat the purpose of allowing for an input.
     *  In this function we will then call our mutate function that we destructured earlier to create or change
     * a value within the database, passing in the name entered into our form as the argument (using { name }
     * as a parameter enters the value as an object, which is required by our mutate function definition). onSuccess
     * is defined within our mutate function in its original page, and thus can be called to enact within this call
     * of mutate, pulling in the id given from mutate's api call and using it to change the client's routed address
     * to the relevant workspace page. toast.success is added by sonner, a node_module that gives useful informational
     * bits of data. a Toast is a small area that pops up in a defined area to inform the user of something and goes
     * away on its own after a short amount of time - in this we give it a string, simply informing the user that the
     * creation of their workspace was successful. These alerts, in their default form, should always be of the string
     * type. After that, we call our handleClose method to close out the workspace creation modal - ensuring the user
     * can immediately begin interacting with the created workspace.
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        mutate({ name }, {
            onSuccess(id) {
                toast.success('workspace created')
                router.push(`/workspace/${id}`);
                handleClose();
            }
        })
    }
    
    return (
        <Dialog open={open} onOpenChange={handleClose} >
            <DialogContent className="bg-neutral-300">
                <DialogHeader>
                    <DialogTitle>Add a Workspace</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <Input
                        onChange={e => setName(e.target.value)}
                        value={name}
                        disabled={isPending}
                        required
                        autoFocus
                        minLength={3}
                        placeholder="Workspace Name ('Work', 'Personal', 'Home')"
                    />
                    <div className="flex justify-end">
                        <Button disabled={isPending}>
                            Create
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
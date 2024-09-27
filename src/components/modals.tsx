'use client';

import { useEffect, useState } from "react";

import { CreateChannelModal } from "@/features/channels/components/create-channel-modal";
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal";

/** Modals create something called a 'Hydration Error' when there are too many opening, or when they are opened
 * by the client before they're properly loaded by the server - thus we use this component to ensure that our client
 * waits until the modal is loaded and mounted by the server before allowing the client to load it. We use a state
 * variable of 'mounted' that defaults to false, and then our useEffect hook will run only once the server is finished
 * mounting the page, turning 'mounted' to true, and thus allowing the loading of the modal in question. This is a 
 * useful method for dealing with hydration errors before they become a problem.
*/
export const Modals = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, [])

    if(!mounted) return null;

    return (
        <>
            <CreateChannelModal />
            <CreateWorkspaceModal />
        </>
    )
}
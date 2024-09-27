'use client'

import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { useRouter } from "next/navigation";


const WorkspaceIdPage = () => {
    const router = useRouter();
    try{
        const userId = useCurrentUser();

        if(!userId) {
            router.replace('/auth')
        }
    } catch {
        router.replace('/auth')
    }



    /**This is the main location for the page information displayed on our workspace page. */
    return ( 
        <div>
            Workspace Id Page
        </div>
     );
}
 
export default WorkspaceIdPage;
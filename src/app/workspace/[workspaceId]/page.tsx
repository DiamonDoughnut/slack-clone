'use client';

import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspaces";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useParams } from "next/navigation";


const WorkspaceIdPage = () => {
    const workspaceId = useWorkspaceId();
    const { data } = useGetWorkspace({ id: workspaceId });
    /**This is the main location for the page information displayed on our workspace page. */
    return ( 
        <div>
            Data: {JSON.stringify(data)}
        </div>
     );
}
 
export default WorkspaceIdPage;
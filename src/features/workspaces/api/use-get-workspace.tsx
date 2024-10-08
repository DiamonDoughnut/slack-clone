import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetWorkspaceProps {
    id: Id<'workspaces'>;
}

export const useGetWorkspace = ({ id }: UseGetWorkspaceProps) => {
    /*The query below is a custom query to our database defined in convex/workspaces.ts*/
    const data = useQuery(api.workspaces.getById, { id });
    const isLoading = data === undefined;

    return { data, isLoading };
}
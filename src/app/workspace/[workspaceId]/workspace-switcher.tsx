import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces';
import { useCreateWorkspaceModal } from '@/features/workspaces/store/use-create-workspace-modal';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { Loader, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

const WorkspaceSwitcher = () => {
    const router = useRouter();

    const workspaceId = useWorkspaceId()
    const [_open, setOpen] = useCreateWorkspaceModal()

    /**this destructuring is called variable reassignment. In this example, the data variable returned in the object
     * from useGetWorkspace is renamed to 'workspace' for use in this file. This is useful in cases like this, where
     * multiple functional call return objects with properties that have identical names. It's helpful to name these
     * re-assignments to something that helps to easily differentiate between them so as to avoid confusion.
     */
    const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId });
    const { data: workspaces } = useGetWorkspaces();
        console.log(_open)
    const filteredWorkspaces = workspaces?.filter(
        
        (workspace) => workspace?._id !== workspaceId
    )

    return ( 
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className='size-9 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-slate-800 font-semibold text-xl'>
                    {workspaceLoading ? (
                        <Loader className='size-5 animate-spin shrink-0' />
                    ) : (
                        workspace?.name.charAt(0).toUpperCase()
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align='start' className='w-64'>
                    <DropdownMenuItem
                      onClick={() => router.push(`/workspace/${workspaceId}`)}
                      className='
                        cursor-pointer
                        flex-col
                        justify-start
                        capitalize
                      '
                    >
                        {workspace?.name}
                        <span className='text-xs text-muted-foreground'>
                            Active Workspace
                        </span>
                    </DropdownMenuItem>
                    {filteredWorkspaces?.map((workspace) => (
                        <DropdownMenuItem
                          key={workspace._id}
                          className='cursor-pointer capitalize overflow-hidden'
                          onClick={() => router.push(`/workspace/${workspace._id}`)}
                        >
                            <div className="
                              shrink-0
                              size-9 
                              relative 
                              overflow-hidden 
                              bg-[#616061]
                              text-slate-800
                              font-semibold
                              text-lg
                              rounded-md
                              flex
                              items-center
                              justify-center
                              mr-2
                        ">
                                <p className='truncate'>{workspace.name.charAt(0).toUpperCase()}</p>
                            </div>
                            {workspace.name}
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem 
                      className='cursor-pointer'
                      onClick={() => setOpen(true)}
                    >
                        <div className="
                          size-9 
                          relative 
                          overflow-hidden 
                          bg-[#F2F2F2]
                          text-slate-800
                          font-semibold
                          text-lg
                          rounded-md
                          flex
                          items-center
                          justify-center
                          mr-2
                        ">
                            <Plus />
                        </div>
                        Create a new Workspace
                    </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>    
     );
}
 
export default WorkspaceSwitcher;
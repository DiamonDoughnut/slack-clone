'use client';

import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";

import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";



export default function Home() {

  const router = useRouter();

  const { data, isLoading } = useGetWorkspaces();

  const [open, setOpen] = useCreateWorkspaceModal();

  const workspaceId = useMemo(() => data?.[0]?._id, [data])

  

  /**This is our homepage, used to create the initial workspace for a user by holding a location to show the modal
   * used in the creation thereof without using the auth pages as a background. Our functions below here force the
   * user to create a new workspace if they have none, as well as redirect them to the first available workspace
   * if they have one that does exist. In addition, this page will redirect the user to their workspace when they 
   * create a new one. The useEffect hook first waits for the API call to finish, then will look to see if there's
   * an available workspace. If there is, it forces the user to that workspace page, and if there is not, it forces
   * the creation modal open so the user can create a new one.
   *  This page will also define the presence of the user photo for access to the logout button and other such user
   * features.
   */
  useEffect(() => {
    if(isLoading) return;
    if(!workspaceId){
        router.replace('/auth');
      }
    if(workspaceId) {
      console.log('redirect to workspace')
      router.replace(`/workspace/${workspaceId}`)
    }else if (!open){
      setOpen(true)
    }
    
  }, [workspaceId, isLoading, open, setOpen, router])

  return (
    <div>
      <Loader className="size-10 animate-spin text-muted-foreground" />
    </div>
  );
}

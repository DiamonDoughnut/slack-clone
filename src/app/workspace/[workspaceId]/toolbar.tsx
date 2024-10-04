import { Button } from "@/components/ui/button"
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/useWorkspaceId"
import { Info, Search } from "lucide-react"
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut
} from '@/components/ui/command'
import { useState } from "react";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetMembers } from "@/features/members/api/use-get-members";
import Link from "next/link";
import { useRouter } from "next/navigation";

//This is a component for the [workspaceId] page.tsx, but with app-router, we don't need it to be in a specific
//components directory, and can quite literally put it anywhere, so long as the import is written correctly.

export const Toolbar = () => {
    const workspaceId = useWorkspaceId();
    const router = useRouter();
    //the useGetWorkspace hook is cached in the system as a global state the first time it's called and any
    //time it's changed, so subsequent calls with the same parameters isn't a new query, but a reread of the old
    //response. This provides for faster load times and a smoother user interaction. This is the same as a React
    //Hook and can be used in similar situations to perform custom functions. Code for this method call is in
    //src/app/features/workspaces/api/use-get-workspace.ts, while the id Query above is in convex/workspaces.ts
    const { data } = useGetWorkspace({ id: workspaceId });
    const { data: channels } = useGetChannels({ workspaceId });
    const { data: members } = useGetMembers({ workspaceId })

    const [open, setOpen] = useState(false) 

    const onChannelClick = (channelId: string) => {
        setOpen(false)
    
        router.push(`/workspace/${workspaceId}/channel/${channelId}`)
    }

    const onMemberClick = (memberId: string) => {
        setOpen(false)
    
        router.push(`/workspace/${workspaceId}/member/${memberId}`)
    }

    return (
        <nav className="bg-[#481349] flex items-center justify-between h-10 p-1.5">
            <div className="flex-1"></div>
            <div className="min-w-[280px] max-w-[642 px] grow-[2] shrink">
                {/*The components from "shadcn" are loaded to the app/components folder, where their styling and 
                properties can be defined and changed as wanted/needed for the project at hand. For the Button component
                this includes variant and size. All styling in shadcn is done with tailwindCss. */}
                <Button onClick={() => setOpen(true)} size="sm" className="bg-accent/25 hover:bg-accent/25 w-full justify-start h-7 px-2">
                    <Search className="size-4 text-white mr-2" />
                        <span className="text-white text-xs">
                            Search {data?.name}
                        </span>
                </Button>
                <CommandDialog open={open} onOpenChange={setOpen}>
                    <CommandInput placeholder="Type a Command or Search" />
                    <CommandList>
                        <CommandEmpty>No results found</CommandEmpty>
                        <CommandGroup heading='Channels'>
                            {channels?.map((channel) => (
                                <CommandItem key={channel._id} onSelect={() => onChannelClick(channel._id)}>
                                        {channel.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup heading='Members'>
                            {members?.map((member) => (
                                <CommandItem key={member._id} onSelect={() => onMemberClick(member._id)}>
                                        {member.user.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </CommandDialog>                        

            </div>
            <div className="ml-auto flex-1 flex items-center justify-end">
                <Button variant="transparent" size='iconSm'>
                    <Info className="size-5 text-white " />
                </Button>
            </div>
        </nav>
    )
}
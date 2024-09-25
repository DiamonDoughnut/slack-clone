import { Button } from "@/components/ui/button"
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspaces";
import { useWorkspaceId } from "@/hooks/useWorkspaceId"
import { Info, Search } from "lucide-react"

//This is a component for the [workspaceId] page.tsx, but with app-router, we don't need it to be in a specific
//components directory, and can quite literally put it anywhere, so long as the import is written correctly.

export const Toolbar = () => {
    const workspaceId = useWorkspaceId();
    //the useGetWorkspace hook is cached in the system as a global state the first time it's called and any
    //time it's changed, so subsequent calls with the same parameters isn't a new query, but a reread of the old
    //response. This provides for faster load times and a smoother user interaction. This is the same as a React
    //Hook and can be used in similar situations to perform custom functions. Code for this method call is in
    //src/app/features/workspaces/api/use-get-workspace.ts, while the id Query above is in convex/workspaces.ts
    const { data } = useGetWorkspace({ id: workspaceId });

    return (
        <nav className="bg-[#481349] flex items-center justify-between h-10 p-1.5">
            <div className="flex-1"></div>
            <div className="min-w-[280px] max-w-[642 px] grow-[2] shrink">
                {/*The components from "shadcn" are loaded to the app/components folder, where their styling and 
                properties can be defined and changed as wanted/needed for the project at hand. For the Button component
                this includes variant and size. All styling in shadcn is done with tailwindCss. */}
                <Button size="sm" className="bg-accent/25 hover:bg-accent/25 w-full justify-start h-7 px-2">
                    <Search className="size-4 text-white mr-2" />
                        <span className="text-white text-xs">
                            Search {data?.name}
                        </span>
                </Button>
            </div>
            <div className="ml-auto flex-1 flex items-center justify-end">
                <Button variant="transparent" size='iconSm'>
                    <Info className="size-5 text-white " />
                </Button>
            </div>
        </nav>
    )
}
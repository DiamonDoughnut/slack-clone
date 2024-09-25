import { UserButton } from "@/features/auth/components/user-button"
import WorkspaceSwitcher from "./workspace-switcher"
import { SidebarButton } from "./sidebar-button"
/**Lucide-React icons cann be imported with <item> or <item>Icon. This makes them easy to use even when you have 
 * components that have the same name as the icon you wish to use.
 */
import { BellIcon, Home, MessagesSquareIcon, MoreHorizontal } from "lucide-react"
import { usePathname } from "next/navigation"

export const Sidebar = () => {
    /**usePathname from next/navigation allows for turning the URL path of a page into a variable - useful for 
     * situations where you want the same thing (like a nav bar) visible throughout your site, but with different
     * information or styling depending on the page currently being accessed.
     */
    const pathname = usePathname();

    return (
        <aside className="w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-9 pb-4">
            <WorkspaceSwitcher />
            <SidebarButton icon={Home} label='Home' isActive={pathname.includes('/workspace')}/>
            <SidebarButton icon={MessagesSquareIcon} label='DMs' />
            <SidebarButton icon={BellIcon} label='Activity' />
            <SidebarButton icon={MoreHorizontal} label='More' />
            <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
                <UserButton />
            </div>
        </aside>
    )
}
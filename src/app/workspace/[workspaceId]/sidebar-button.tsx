import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";

interface SidebarButtonProps {
    icon: LucideIcon | IconType;
    label: string;
    isActive?: boolean;
}
/**Pulls the properties in from the element call in parent, any of these props that are going to be used as their own
 * HTML Element must be remapped to be capitalized at the start, as the initial properties must be in CamelCase. (see
 * icon below as example.)
 */
export const SidebarButton = ({
    icon: Icon,
    label,
    isActive
} : SidebarButtonProps) => {
    return ( 
        <div className="flex flex-col items-center justify-center gap-y-0.5 cursor-pointer group">
            <Button 
              variant='transparent' 
              className={
                /**cn is a tailwind property that allows for conditional rendering - more reliable than a
                 * Ternary expression for conditional styling in situations like this button setup. Input schema is
                 * cn('default styling', condition && 'conditional styling') */ 
                cn(
                    'size-9 p-2 group-hover:bg-accent/20',
                    isActive && 'bg-accent/20'
                )
              }
            >
                <Icon className="size-5 text-white group-hover:scale-110 transition-all" />
            </Button>
            <span className="text-[11px] text-white group-hover:text-accent">
                {label}
            </span>
        </div>
     );
}
 

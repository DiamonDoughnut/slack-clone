import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";

import { Id } from "../../../../convex/_generated/dataModel";

import { Button } from "@/components/ui/button";

/**This import is what's going to allow us to create variants for our component and comes included with the dependency
 * install for ShadCn's components.
 */
import { cva, type VariantProps } from 'class-variance-authority'

import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { cn } from "@/lib/utils";

/**This is where we'll create our variants that can then be used in the same way as ShadCn's component variants. 
 * The first argument is a string with the tailwindCss styling of the default component variant, the second is an 
 * object with two properties: 'variants' and 'defaultVariants'. The first is an object with the properties being 
 * the desired variant names and their values being the desired tailwindCss styling. The second is also an object,
 * the property being 'variant' and the value being a string that is the property of the chosen variant above, allowing
 * the property to be left off of the parent's Element call and have the component still maintain a desired styling.
 * This is basically identical to the way ShadCn writes their variants, and therefore can be called in the same way
 * when using this component elsewhere. By doing this in a component with several properties, we can make the component
 * completely customizable through properties rather than attempting to pass in children and get them to format
 * properly, instead doing all the formatting directly and simply changing the props to change the children.
 */
const sidebarItemVariants = cva(
    'flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden',
    {
        variants: {
            variant: {
                default: 'text-[#f9edffcc]',
                active: 'text-[#481349] bg-white/90 hover:bg-white/90'
            }
        },
        defaultVariants: {
            variant: 'default'
        }
    }
);

interface SidebarItemProps {
    label: string;
    id: string;
    icon: LucideIcon | IconType;
    variant?:  VariantProps<typeof sidebarItemVariants>['variant']
};

export const SidebarItem = ({
    label,
    id,
    icon: Icon,
    variant
}: SidebarItemProps) => {
    const workspaceId = useWorkspaceId();

    /**We're going to take a page out of ShadCn's book, following their template to implement variants into this 
     * component. The Reusability of this template makes it an effective and powerful tool in any program. Passing
     * the variant prop as defined above into a component as the className property, we can then use the style entered
     * as the 'variant' value in the parent based on the choice made within that individual file rather than trying to
     * deeply style components via states and props.
     * 
     * the 'asChild' prop on components must be used when they either are or contain a button within their own direct
     * code and will also receive a button as a child element. Leaving this property off creates a hydration error, as
     * React does not like nested buttons. The asChild property simply tells the component that any functions associated
     * with the activation of its own onClick property should instead be activated when the onClick property of any of 
     * its children are clicked instead. This allows for formatting where within a component the click should register
     * in case you don't wish for the whole thing to be clickable, or in the case that you wish to use the styling of
     * a different component to perform the function of the component you're building. This can be seen in several places
     * throughout our workspace-sidebar component and its children, i.e. the use of buttons within DropdownTrigger 
     * components from ShadCn, which themselves include and are a button.
     */

    return (
        <Button
            variant='transparent'
            size='sm'
            asChild
            className={cn(sidebarItemVariants({ variant: variant }))}
        >
            <Link href={`/workspace/${workspaceId}/channel/${id}`}>
                <Icon className="size-3.5 mr-1 shrink-0" />
                <span className='text-small truncate'>{label}</span>
            </Link>
        </Button>
    )
}
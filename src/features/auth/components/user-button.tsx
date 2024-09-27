
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from '@/components/ui/avatar'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useCurrentUser } from '../api/use-current-user'
import { Loader, LogOut } from 'lucide-react'
import { useAuthActions } from '@convex-dev/auth/react'
import { useRouter } from 'next/navigation'

export const UserButton = () => {
    const router = useRouter();

    /**The data and isLoading variables are destructured from our useCurrentUser hook, allowing us to access the user's
     * name and information for displaying things such as profile image and available workspaces, as well as provide a
     * skeleton loading state for these values.
     *  Below that, we destructure the signOut method from the useAuthActions hook so that we can create a button that
     * the user can click on to log out and invalidate their session. We then forcefully route the user away from the 
     * page they're on and back to the signIn/signUp page in order to protect sensitive information.
     */
    const { data, isLoading } = useCurrentUser()

    const { signOut } = useAuthActions();

    /**This allows for the implementation of a skeleton loading state - using our isLoading variable from the 
     * useCurrentUser hook to display the conditional return only while the API call hasn't resolved. The return
     * here can also be more complex - closer to the normal page, but at that stage, the better thing to do would be
     * to use a ternery operator.
     */
    if(isLoading) {
        return <Loader className="size-4 animate-spin text-muted-foreground" />
    }

    if(!data) {
        return null;
    }

    /**This is a destructuring of the data we wish to use, so as to avoid the unnecessary use of dot notation when
     * calling these variables. This allows for easier reading of our code as well as easier debugging if needed. 
     */
    const { image, name, email } = data

    /**If the user profile doesn't have an included image, we use this to fall back on a simple circle with the first
     * letter of their input name in the center. This allows the user to feel as if they're still getting the full 
     * function of the website without being forced to load in a personal photo or another image if they don't wish to.
     */
    const avatarFallback = name!.charAt(0).toUpperCase()

    const handleSignOut = async () => {
        router.push('/auth'); 
        await signOut().finally(router.refresh());
    }

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="outline-none relative">
                <Avatar className="size-10 hover:opacity-75 transition rounded-md">
                    <AvatarImage alt={name} src={image} className='rounded-md' />
                    <AvatarFallback className='rounded-md bg-sky-500 text-white'>
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='center' side='right' className='w-60'>
                <DropdownMenuItem onClick={() => {handleSignOut()}} className='h-10'>
                    <LogOut className='size-4 mr-2' />
                    Log Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
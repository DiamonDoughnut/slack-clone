import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { useWorkspaceId } from '@/hooks/useWorkspaceId'
import { CopyIcon, RefreshCcw } from 'lucide-react'
import { useNewJoinCode } from '@/features/workspaces/api/use-new-join-code'
import { useConfirm } from '@/hooks/useConfirm'

interface InviteModalProps {
    open: boolean
    setOpen: (open: boolean) => void
    name: string
    joinCode: string
}

export const InviteModal = ({ 
    open,
    setOpen,
    name,
    joinCode
 }: InviteModalProps) => {
    const workspaceId = useWorkspaceId();
    const [ConfirmDialog, confirm] = useConfirm(
        'Are you sure?',
        'This will deactivate the current invite code and generate a new one.'
    )

    const { mutate, isPending } = useNewJoinCode();

    const handleCopy = () => {
        const inviteLink = `${window.location.origin}/join/${workspaceId}`

        navigator.clipboard.writeText(inviteLink).then(
            () => toast.success('Copied to clipboard.')
        )
    }

    const handleNewCode = async () => {
        
            const ok = await confirm();

            if (!ok) {return};
        
        mutate({ workspaceId }, {
            onSuccess: () => {
                toast.success('New Code Ready')
            },
            onError: () => {
                toast.error('Failed to Regenerate Code')
            }
        })
    }

    return ( 
        <>
        <ConfirmDialog />
        <Dialog open={open} onOpenChange={() => (setOpen(false))}>
            <DialogContent className='bg-slate-50'>
                <DialogHeader>
                    <DialogTitle>
                        Invite people to {name}
                    </DialogTitle>
                    <DialogDescription>
                        Use this code:
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-y-4 items-center justify-center py-10">
                    <p className='text-4xl font-bold tracking-widest uppercase'>
                        {joinCode}
                    </p>
                    <Button variant={'ghost'} size={'sm'} onClick={handleCopy}>
                        Copy Link
                        <CopyIcon className='size-4 ml-2' />
                    </Button>
                </div>
                <div className="flex items-center justify-between w-full">
                    <Button disabled={isPending} onClick={handleNewCode} variant={'outline'}>
                        Generate new invite code.
                        <RefreshCcw className='size-4 ml-2' />
                    </Button>
                    <DialogClose asChild>
                        <Button>
                            Close
                        </Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
        </>
    )
}
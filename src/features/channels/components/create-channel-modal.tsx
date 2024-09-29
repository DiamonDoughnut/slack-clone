import { toast } from 'sonner';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useCreateChannelModal } from '../store/use-create-channel-modal'
import { useCreateChannel } from '../api/use-create-channel';

import { useWorkspaceId } from '@/hooks/useWorkspaceId';

export const CreateChannelModal = () => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const { mutate, isPending } = useCreateChannel();
    const [open, setOpen] = useCreateChannelModal();

    const [name, setName] = useState('');


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const value = e.target.value.replace(/\s+/g, '-').toLowerCase();
        setName(value);
    }

    const handleClose = () => {
        setName('');
        setOpen(false);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        mutate({
            name, workspaceId
        },
        {
            onSuccess: (id) => {
                toast.success('Channel Created')
                router.push(`/workspace/${workspaceId}/channel/${id}`)
                handleClose();
            },
            onError: () => {
                toast.error('Failed to create channel')
            }
        })
    }
    
    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className='bg-slate-50'>
                <DialogHeader>
                    <DialogTitle>
                        Add a Channel
                    </DialogTitle>
                </DialogHeader>
                <form className='space-y-4' onSubmit={handleSubmit}>
                    <Input 
                        value={name}
                        disabled={isPending}
                        onChange={handleChange}
                        required
                        autoFocus
                        minLength={3}
                        maxLength={80}
                        placeholder='new-channel'
                    />

                    <div 
                        className='
                            flex
                            justify-end
                        '
                    >
                        <Button
                            disabled={isPending}
                        >
                            Create
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
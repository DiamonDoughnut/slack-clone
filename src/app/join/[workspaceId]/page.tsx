'use client'

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import VerificationInput from 'react-verification-input'

import { useJoin } from "@/features/workspaces/api/use-join";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";

import { cn } from '@/lib/utils'
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";

const JoinPage = () => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();

    const { mutate, isPending } = useJoin();
    const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId });
    const isMember = useMemo(() => data?.isMember, [data?.isMember])

    useEffect(() => {
        if (isMember) {
            router.push(`/workspace/${workspaceId}`);
        }
    }, [isMember, router, workspaceId])

    const handleComplete = (value: string) => {
        mutate({workspaceId, joinCode: value}, {
            onSuccess: (id) => {
                router.replace(`/workspace/${id}`)
                toast.success('Workspace Joined!');
            },
            onError: () => {
                toast.error('Failed to Join Workspace')
            }
        })
    }

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="size-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return ( 
        <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md">
            <Image src='/DDLogo2.svg' width={120} height={120} alt="logo" />
            <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
                <div className="flex flex-col gap-y-2 items-center justify-center">
                    <h1 className="text-2xl font-bold">
                        Join {data?.name}
                    </h1>
                    <p className="text-md text-muted-foreground">
                        Enter Workspace Join Code:
                    </p>
                </div>
                <VerificationInput 
                    length={6}
                    classNames={ {
                        container: cn('flex gap-x-2', isPending && 'opacity-50 cursor-not-allowed'),
                        character: 'uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-md text-gray-500',
                        characterInactive: 'bg-muted',
                        characterSelected: 'bg-white text-black',
                        characterFilled: 'bg-white text-black'
                    } }
                    autoFocus
                    onComplete={handleComplete}
                />
            </div>
            <div className="flex gap-x-4">
                <Button
                    size={'lg'}
                    variant={'outline'}
                    asChild
                >
                    <Link href={'/'}>
                        Home
                    </Link>
                </Button>
            </div>
        </div>
     );
}
 
export default JoinPage;
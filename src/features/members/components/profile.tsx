import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetMember } from "../api/use-get-member";
import {
  AlertTriangle,
  ChevronDownIcon,
  Loader,
  MailIcon,
  XIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useUpdateMember } from "../api/use-update-member";
import { useRemoveMember } from "../api/use-remove-member";
import { useCurrentMember } from "../api/use-current-member";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/useConfirm";
import { useRouter } from "next/navigation";

interface ProfileProps {
  memberId: Id<"members">;
  onClose: () => void;
}

export const Profile = ({ memberId, onClose }: ProfileProps) => {
  const router = useRouter();
  const [UpdateDialog, confirmUpdate] = useConfirm(
    "Change Member Role?",
    "Are you sure you wish to assign a new role to this member?."
  );

  const [LeaveDialog, confirmLeave] = useConfirm(
    "Leave Workspace?",
    "You can only return with an invite from a member."
  );

  const [RemoveDialog, confirmRemove] = useConfirm(
    "Remove Member from Workspace?",
    "Are you sure you wish to remove this member from the Workspace?"
  );

  const workspaceId = useWorkspaceId();

  const { data: currentMember, isLoading: isLoadingCurrentMember } =
    useCurrentMember({ workspaceId });
  const { data: member, isLoading: isLoadingMember } = useGetMember({
    id: memberId,
  });

  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember();
  const { mutate: removeMember, isPending: isRemovingMember } =
    useRemoveMember();

  const onRemove = async () => {
    const ok = await confirmRemove();

    if (!ok) return;

    removeMember(
      { id: memberId },
      {
        onSuccess: () => {
          toast.success("User Removed from Channel");
          onClose();
        },
        onError: () => {
          toast.error("Unable to Remove User from Channel");
        },
      }
    );
  };

  const onLeave = async () => {
    const ok = await confirmLeave();

    if (!ok) return;

    removeMember(
      { id: memberId },
      {
        onSuccess: () => {
          toast.success("Workspace Left");
          router.replace('/')
          onClose();
        },
        onError: () => {
          toast.error("Unable to Leave Workspace");
        },
      }
    );
  };

  const onUpdate = async (role: "admin" | "member") => {
    const ok = await confirmUpdate();

    if (!ok) return;

    updateMember(
      { id: memberId, role },
      {
        onSuccess: () => {
          toast.success("Member role changed");
          onClose();
        },
        onError: () => {
          toast.error("Unable to change member role");
        },
      }
    );
  };

  if (isLoadingMember || isLoadingCurrentMember) {
    return (
      <div className='h-full flex flex-col'>
        <div className='flex justify-between items-center h-[49px] px-4 border-b'>
          <p className='text-lg font-bold'>Profile</p>
          <Button
            onClick={onClose}
            size={"iconSm"}
            variant={"ghost"}
          >
            <XIcon className='size-5 stroke-1.5' />
          </Button>
        </div>
        <div className='flex h-full items-center justify-center'>
          <Loader className='size-5 animate-spin text-muted-foreground' />
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className='h-full flex flex-col'>
        <div className='flex justify-between items-center h-[49px] px-4 border-b'>
          <p className='text-lg font-bold'>Profile</p>
          <Button
            onClick={onClose}
            size={"iconSm"}
            variant={"ghost"}
          >
            <XIcon className='size-5 stroke-1.5' />
          </Button>
        </div>
        <div className='flex flex-col gap-y-2 h-full items-center justify-center'>
          <AlertTriangle className='size-5 text-muted-foreground' />
          <p className='text-sm text-muted-foreground'>Profile Not Found</p>
        </div>
      </div>
    );
  }

  const fallback = member.user.name?.[0].toUpperCase() ?? "M";

  const isAdmin = currentMember?.role === "admin";
  const isSelf = currentMember?._id === memberId;

  return (
    <>
      <RemoveDialog />
      <LeaveDialog />
      <UpdateDialog />
      <div className='h-full flex flex-col'>
        <div className='flex justify-between items-center h-[49px] px-4 border-b'>
          <p className='text-lg font-bold'>Profile</p>
          <Button
            onClick={onClose}
            size={"iconSm"}
            variant={"ghost"}
          >
            <XIcon className='size-5 stroke-1.5' />
          </Button>
        </div>
        <div className='flex flex-col items-center justify-center p-4'>
          <Avatar className='max-w-[256px] max-h-[256px] size-full'>
            <AvatarImage src={member.user.image} />
            <AvatarFallback className='aspect-square text-6xl'>
              {fallback}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className='flex flex-col p-4'>
          <p className='text-xl font-bold'>{member.user.name}</p>
          {isAdmin && !isSelf ? (
            <div className='flex items-center gap-2 mt-4'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={"outline"}
                    className='w-full capitalize'
                  >
                    {member.role} <ChevronDownIcon className='size-4 ml-2' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-full'>
                  <DropdownMenuRadioGroup
                    value={member.role}
                    onValueChange={(role) => onUpdate(role as 'admin' | 'member')}
                  >
                    <DropdownMenuRadioItem value='admin'>
                      Admin
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value='member'>
                      Member
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant={"outline"}
                className='w-full'
                onClick={onRemove}
              >
                Remove
              </Button>

            </div>
          ) : !isAdmin && isSelf ? (
            <div className='mt-4'>
              <Button
                variant={"outline"}
                className='w-full'
                onClick={onLeave}
              >
                Leave
              </Button>
            </div>
          ) : null}
        </div>
        <Separator />
        <div className='flex flex-col p-4'>
          <p className='text-small font-bold mb-4'>Contact Information</p>
          <div className='flex items-center gap-2'>
            <div className='size-9 rounded-md background-muted flex items-center justify-center'>
              <MailIcon className='size-4' />
            </div>
            <div className='flex flex-col'>
              <p className='text-13px font-semibold text-muted-foreground'>
                Email Address:
              </p>
              <Link
                href={`mailto:${member.user.email}`}
                className='text-sm hover:underline text-[#1264A3]'
              >
                {member.user.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

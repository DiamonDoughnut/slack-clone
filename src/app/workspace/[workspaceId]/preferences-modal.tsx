/**This will be a Modal popup screen that can be used to edit the name or members of the current workspace and also to
 * delete it when no longer wanted/needed by the user.
 */

import React, { useState } from "react";

import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";
import { useRemoveWorkspace } from "@/features/workspaces/api/use-remove-workspace";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";

import { TrashIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/useConfirm";

interface PreferencesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValue: string;
}

export const PreferencesModal = ({
  open,
  setOpen,
  initialValue,
}: PreferencesModalProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const [value, setValue] = useState(initialValue);
  const [editOpen, setEditOpen] = useState(false);
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you Sure?",
    "This action is irreversable"
  );

  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
    useUpdateWorkspace();
  const { mutate: removeWorkspace, isPending: isRemovingWorkspace } =
    useRemoveWorkspace();

  const handleRemove = async () => {
    const ok = await confirm();

    if(!ok) {
        return;
    }

    removeWorkspace(
      {
        id: workspaceId,
      },
      {
        onSuccess: () => {
          router.replace("/");
          setEditOpen(false);
          toast.success("Workspace Deleted");
        },
        onError: () => {
          toast.error("Workspace Removal Failed");
        },
      }
    );
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateWorkspace(
      {
        id: workspaceId,
        name: value,
      },
      {
        onSuccess: () => {
          setEditOpen(false);
          toast.success("Workspace Renamed");
        },
        onError: () => {
          toast.error("Rename Failed");
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog className='bg-slate-50 bg-opacity-90' />
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogContent className='p-0 bg-gray-50 overflow-hidden'>
          <DialogHeader className='p-4 border-b bg-white'>
            <DialogTitle>{value}</DialogTitle>
          </DialogHeader>
          <div className='px-4 pb-4 flex flex-col gap-y-2'>
            <Dialog
              open={editOpen}
              onOpenChange={setEditOpen}
            >
              <DialogTrigger asChild>
                <div className='px-5 py-4-bg-white rounded-lg border cursor-pointer hover:bg-gray-50'>
                  <div className='flex items-center justify-between'>
                    <p className='text-small font-semibold'>Workspace Name</p>
                    <p className='text-small text-[#1264A3] hover:underline font-semibold'>
                      Edit
                    </p>
                  </div>
                  <p className='text-sm'>{value}</p>
                </div>
              </DialogTrigger>
              <DialogContent className='bg-gray-50'>
                <DialogHeader>
                  <DialogTitle>Rename this Workspace:</DialogTitle>
                </DialogHeader>
                <form
                  className='space-y-4'
                  onSubmit={handleEdit}
                >
                  <Input
                    value={value}
                    disabled={isUpdatingWorkspace}
                    onChange={(e) => setValue(e.target.value)}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder='Workspace Name eg. "Work", "Personal", "Home"'
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        variant='outline'
                        disabled={isUpdatingWorkspace}
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button disabled={isUpdatingWorkspace}>Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <button
              disabled={isRemovingWorkspace}
              onClick={handleRemove}
              className='
                            flex
                            items-center
                            gap-x-2
                            px-5
                            py-4
                            bg-white
                            rounded-lg
                            border
                            cursor-pointer
                            hover:background-gray-50
                            text-rose-600
                        '
            >
              <TrashIcon className='size-4' />
              <p className='text-small font-semibold'>Delete Workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

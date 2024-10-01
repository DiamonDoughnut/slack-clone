import dynamic from "next/dynamic";
import { toast } from "sonner";
import { format, isYesterday, isToday } from "date-fns";

import { useUpdateMessage } from "@/features/messages/api/use-update-message";
import { useRemoveMessage } from "@/features/messages/api/use-remove-message";
import { useToggleReaction } from "@/features/reactions/api/use-toggle-reaction";

import { cn } from "@/lib/utils";
import { useConfirm } from "@/hooks/useConfirm";

import { Hint } from "./hint";
import { Toolbar } from "./toolbar";
import { Thumbnail } from "./thumbnail";
import { Reactions } from "./reactions";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

import { Doc, Id } from "../../convex/_generated/dataModel";

const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false });
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface MessageProps {
  id: Id<"messages">;
  memberId: Id<"members">;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  body: Doc<"messages">["body"];
  image: string | null | undefined;
  createdAt: Doc<"messages">["_creationTime"];
  updatedAt: Doc<"messages">["updatedAt"];
  isEditing: boolean;
  isCompact?: boolean;
  setEditingId: (id: Id<"messages"> | null) => void;
  hideThreadButton?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadTimestamp?: number;
}

const formatFullTime = (date: Date) => {
  return `${
    isToday(date)
      ? "Today"
      : isYesterday(date)
        ? "Yesterday"
        : format(date, "MMM d, yyyy")
  } at ${format(date, "h:mm:ss a")}`;
};

export const Message = ({
  id,
  isAuthor,
  memberId,
  authorImage,
  authorName = "Member",
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  isEditing,
  isCompact,
  setEditingId,
  hideThreadButton,
  threadCount,
  threadImage,
  threadTimestamp,
}: MessageProps) => {
  const avatarFallback = authorName.charAt(0).toUpperCase();
  const [ConfirmDialog, confirm] = useConfirm(
    'Delete Message?',
    'This action is irreversible.'
  );

  const { mutate: updateMessage, isPending: isUpdatingMessage } =
    useUpdateMessage();
  const { mutate: removeMessage, isPending: isRemovingMessage } = 
    useRemoveMessage();  
  const { mutate: toggleReaction, isPending: isTogglingReaction } = useToggleReaction();  

  const isPending = isUpdatingMessage || isRemovingMessage || isTogglingReaction;

  const handleReaction = (value: string) => {
    toggleReaction({ messageId: id, value }, {
      onError: () => {
        toast.error('Reaction Failed')
      }
    })
  }

  const handleRemove = async () => {
    const ok = await confirm();

    if(!ok) return;
    
    removeMessage({ id }, {
      onSuccess: () => {
        toast.success('Message Deleted');

        //TODO - Close thread if last opened
      },
      onError: () => {

        toast.error('Delete Failed')
      
      }
    })
  }

  const handleUpdate = ({ body }: { body: string }) => {
    updateMessage(
      { id, body },
      {
        onSuccess: () => {
          toast.success("Message Updated");
          setEditingId(null);
        },
        onError: () => {
          toast.error("Edit Failed");
        },
      }
    );
  };

  return isCompact ? (
    <>
    <ConfirmDialog />
    <div
      className={cn(
        "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
        isEditing && "bg-[#F2C74433] hover:bg-[#F2C74433]",
        isRemovingMessage && 
          'bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200'
      )}
    >
      {isEditing ? (
        <div className='w-full h-full'>
          <Editor
            onSubmit={handleUpdate}
            disabled={isPending}
            defaultValue={JSON.parse(body)}
            onCancel={() => setEditingId(null)}
            variant='update'
          />
        </div>
      ) : (
        <div className='flex items-start gap-2'>
          <Hint label={formatFullTime(new Date(createdAt))}>
            <button className='text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline'>
              {format(new Date(createdAt), "hh:mm")}
            </button>
          </Hint>
          <div className='flex flex-col w-full'>
            <Renderer value={body} />
            <Thumbnail url={image} />
            {updatedAt && (
              <span className='text-xs text-muted-foreground'>(edited)</span>
            )}
            <Reactions
              data={reactions}
              onChange={handleReaction}
            />
          </div>
        </div>
      )}
      {!isEditing && (
        <Toolbar
          isAuthor={isAuthor}
          isPending={isPending}
          handleEdit={() => setEditingId(id)}
          handleThread={() => {}}
          handleDelete={handleRemove}
          hideThreadButton={hideThreadButton}
          handleReaction={handleReaction}
        />
      )}
    </div>
    </>
  ) : (
    <>
    <ConfirmDialog />
    <div
      className={cn(
        "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
        isEditing && "bg-[#F2C74433] hover:bg-[#F2C74433]",
        isRemovingMessage && 
          'bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200'
      )}
    >
      <div className='flex items-start gap-2'>
        <button>
          <Avatar>
            <AvatarImage src={authorImage} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        </button>
        {isEditing ? (
          <div className='w-full h-full'>
            <Editor
              onSubmit={handleUpdate}
              disabled={isPending}
              defaultValue={JSON.parse(body)}
              onCancel={() => setEditingId(null)}
              variant='update'
            />
          </div>
        ) : (
          <div className='flex flex-col w-full overflow-hidden'>
            <div className='text-sm'>
              <button
                className='font-bold text-primary hover:underline'
                onClick={() => {}}
              >
                {authorName}
              </button>
              <span>&nbsp;&nbsp;</span>
              <Hint label={formatFullTime(new Date(createdAt))}>
                <button className='text-xs text-muted-foreground hover:underline'>
                  {format(new Date(createdAt), "h:mm a")}
                </button>
              </Hint>
            </div>
            <Renderer value={body} />
            <Thumbnail url={image} />
            {updatedAt && (
              <span className='text-xs text-muted-foreground'>(edited)</span>
            )}
            <Reactions
              data={reactions}
              onChange={handleReaction}
            />
          </div>
        )}
      </div>
      {!isEditing && (
        <Toolbar
          isAuthor={isAuthor}
          isPending={isPending}
          handleEdit={() => setEditingId(id)}
          handleThread={() => {}}
          handleDelete={handleRemove}
          hideThreadButton={hideThreadButton}
          handleReaction={handleReaction}
        />
      )}
    </div>
    </>
  );
};

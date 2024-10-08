import { usePaginatedQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const BATCH_SIZE = 20

interface UseGetMessagesProps {
    channelId?: Id<'channels'>
    conversationId?: Id<'conversations'>
    parentMessageId?: Id<'messages'>
}
//@ts-expect-error: pagination return type doesn't implicitly have 'page' property, but does after pagination
export type GetMessagesReturnType = typeof api.messages.get._returnType["page"];

export const useGetMessages = ({
    channelId,
    conversationId,
    parentMessageId
}: UseGetMessagesProps) => {
    const { results, status, loadMore } = usePaginatedQuery(
        //@ts-expect-error: pagination return type doesn't implicitly have 'page' property, but does after pagination
        api.messages.get,
        { channelId, conversationId, parentMessageId },
        { initialNumItems: BATCH_SIZE }
    )

    return {
        results,
        status,
        loadMore: () => loadMore(BATCH_SIZE)
    }
}
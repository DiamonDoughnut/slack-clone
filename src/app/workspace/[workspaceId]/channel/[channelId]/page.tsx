'use client'

import { Loader, TriangleAlert } from "lucide-react";

import { useGetChannel } from "@/features/channels/api/use-get-channel";

import { useChannelId } from "@/hooks/useChannelId";
import { Header } from "./header";
import { ChatInput } from "./chat-input";

const ChannelIdPage = () => {
    const channelId = useChannelId();

    const { data: channel, isLoading: channelLoading } = useGetChannel({ id: channelId });

    if (channelLoading) {
        return (
            <div className="h-full flex-1 flex items-center justify-center">
                <Loader className="size-5 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!channel) {
        return (
            <div className="h-full flex-1 flex flex-col gap-y-2 items-center justify-center">
                <TriangleAlert className="size-6 text-muted-foreground" />
                <span className="text-small text-muted-foregroun">
                    Channel Not Found
                </span>
            </div>
        )
    }

    return ( 
        <div className="flex flex-col h-full">
            <Header name={channel.name} />
            <div 
              className="
                flex-1
              "
            />
            <ChatInput placeholder={`message #${channel.name}`} />
        </div>    
     );
}
 
export default ChannelIdPage;
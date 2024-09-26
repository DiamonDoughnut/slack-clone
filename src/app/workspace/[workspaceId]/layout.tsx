'use client'

import { 
    ResizableHandle, 
    ResizablePanel,
    ResizablePanelGroup
} from '@/components/ui/resizable'

import React from "react";
import { Toolbar } from "./toolbar";
import { Sidebar } from "./sidebar";
import { WorkspaceSidebar } from './workspace-sidebar';

/**Interfaces in a layout page define that our 'children' property - that being the list of nesting HTML Elements that
 * will be called to display - are a type of ReactNode, meaning their props can be affected and messed with here
 * and in their nested components.
 */
interface WorkspaceIdLayoutProps {
    children: React.ReactNode;
}

const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
    return (
        (<div className="h-full">
            <Toolbar />
            <div className="flex h-[calc(100vh-40px)]">
                <Sidebar />
                <ResizablePanelGroup
                    direction='horizontal'
                    autoSaveId='dd-workspace-layout'
                >
                    <ResizablePanel
                        defaultSize={20}
                        minSize={11}
                        className='bg-[#5E2C5F]'
                    >
                        <WorkspaceSidebar />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel
                        minSize={20}
                    >
                        {children}
                    </ResizablePanel>    
                </ResizablePanelGroup>
            </div>
        </div>)
    );
}
 
export default WorkspaceIdLayout;
'use client'

import React from "react";
import { Toolbar } from "./toolbar";

/**Interfaces in a layout page define that our 'children' property - that being the list of nesting HTML Elements that
 * will be called to display - are a type of ReactNode, meaning their props can be affected and messed with here
 * and in their nested components.
 */
interface WorkspaceIdLayoutProps {
    children: React.ReactNode;
}

const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
    return ( <div className="h-full">
        <Toolbar />
        {children}
    </div> );
}
 
export default WorkspaceIdLayout;
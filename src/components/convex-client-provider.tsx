'use client';

import { ConvexReactClient } from "convex/react";
import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ReactNode } from 'react';

/**This is the component called within our main layout that provides the ability for our page to interact with
 * and update to and from the database in real time. This will be used on multiple pages, so extracting the function
 * to a component is an easy way to prevent retyping the code.
 */
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    return( 
        <ConvexAuthNextjsProvider client={convex}>
            {children}
        </ConvexAuthNextjsProvider>
    )
}
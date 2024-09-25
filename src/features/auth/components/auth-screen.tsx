'use client';

import { useState } from "react";
import { SignInFlow } from "../types";
import { SignInCard } from "./sign-in-card";
import { SignUpCard } from "./sign-up-card";

export const AuthScreen = () => {
    const [state, setState] = useState<SignInFlow>('signIn')
    /**This file is a simple page-wide background component that helps us to style the background of the page
     * as well as using a ternery operator to determine whether our user is supposed to be viewing the sign-in
     * or sign-up form based on the state set above, locked to the values within the types in types.ts
     */

    return (
        <div className="h-full flex items-center justify-center bg-[#5C3B58]">
            <div className="md:h-auto md:w-[420px]">
                {state === 'signIn' ? <SignInCard setState={setState} /> : <SignUpCard setState={setState} />}
            </div>
        </div>
    )
}
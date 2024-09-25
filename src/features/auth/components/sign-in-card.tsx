import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TriangleAlert } from 'lucide-react'
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { SignInFlow } from "../types";
import { useState } from "react";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";

/**An interface allows you to set up a property that has a forced typing, and will cause an error if a value is entered
 * that doesn't conform to that setting. This is extremely useful for cases like this where our SignInFlow is a state
 * that is extremely sensitive to value, and thus needs protection being changed outside of that small list of values.
 */
interface SignInCardProps {
    setState: (state: SignInFlow) => void;
}

export const SignInCard = ({ setState }: SignInCardProps) => {
  const router = useRouter();
  /**useAuthActions is a Convex provided hook that allows for the use of basic authentication functions and methods
   * without being forced to write our own methods to simplify such things. This allows simply for access to 'signIn'
   * and 'signOut', hence why the types provided in SignInFlow are so sensitive.
   */
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false);

  /**The following two functions are both sign-in functions, the first allowing for standard email/password entry signin,
   * the latter being the way to sign in via one of our OAuth providers. The information within these blocks can be 
   * customized to perform the functions wanted within the current app, but will usually be fairly similar.
   *  OAuth providers are much more simple in the setup code, as they provide almost all of the information theirselves.
   *  In addition to this, we throw a useRouter hook within the finally block of both in order to forcefully route the
   * user away from the sign-in and over to the main page, preventing relying on the user for something so tedious as
   * changing URLs after signing up
   */
  const onPasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setPending(true);
    signIn('password', { email, password, flow: "signIn" })
      .catch(() => {
        setError('Invalid Email or Password')
      })
      .finally(() => {
        setPending(false);
        router.replace('/');
      })
  }

  const onProviderSignIn = (value: 'github' | 'google') => {
    setPending(true)
    signIn(value)
    .finally(() => {
      setPending(false)
      router.replace('/');
    });
  };

  return (
    <Card className='w-full h-full p-8'>
      <CardHeader className='px-0 pt-0'>
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      {!!error && (
        <div className="bg-destrcutive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlert size={4} />
          <p>{error}</p>
        </div>
      )}
      <CardContent className='space-y-5 px-0 pb-0'>
        <form onSubmit={onPasswordSignIn} className='space-y-2.5'>
          <Input
            id='email'
            disabled={pending}
            value={email}
            onChange={(e) => {setEmail(e.target.value)}}
            placeholder='Email'
            type='email'
            required
          />
          <Input
            id='password'
            disabled={pending}
            value={password}
            onChange={(e) => {setPassword(e.target.value)}}
            placeholder='Password'
            type='password'
            required
          />
          <Button
            type='submit'
            className='w-full'
            size='lg'
            disabled={pending}
          >
            Continue
          </Button>
        </form>
        <Separator />
        <div className='flex flex-col gap-y-2.5'>
          <Button
            disabled={pending}
            onClick={() => onProviderSignIn('google')}
            variant='outline'
            size='lg'
            className='w-full relative'
          >
            <FcGoogle className='size-5 absolute top-3 left-2.5' />
            Continue with Google
          </Button>
          <Button
            disabled={pending}
            onClick={() => onProviderSignIn('github')}
            variant='outline'
            size='lg'
            className='w-full relative'
          >
            <FaGithub className='size-5 absolute top-3 left-2.5' />
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
            Don&apos;t have an account? <span onClick={() => setState('signUp')} className="text-sky-700 hover:underline cursor-pointer"> Sign Up! </span>
        </p>
      </CardContent>
    </Card>
  );
};

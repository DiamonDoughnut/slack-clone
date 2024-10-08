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

interface SignUpCardProps {
    setState: (state: SignInFlow) => void;
}

/**This file is nearly identical to the SignInCard, changing only the functional names and using the other side of our
 * SignInFlow state, as well as providing an extra input field for Password confirmation. As the password is only used
 * within a single field in our database, we don't send both with the request, only using the confirmation input to 
 * check against the initial value, exiting the function early with a warning if they do not match, otherwise running
 * the registration logic and, like with the sign-in page, forcefully routing the user to the home page. 
 */

export const SignUpCard = ({ setState }: SignUpCardProps) => {
    const router = useRouter();
    const { signIn } = useAuthActions();
    const [name, setName] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('')
    const [pending, setPending] = useState(false);

    const onPasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if(password !== confirmPassword){
        setError('Passwords Do Not Match');
        return;
      }

      setPending(true);
      signIn('password', { name, email, password, flow: 'signUp' })
        .catch(() => {
          setError('Something Went Wrong');
        })
        .finally(() => {
          setPending(false)
          router.replace('/');
        })
    }  

    const onProviderSignUp = (value: 'github' | 'google') => {
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
        <CardTitle>Sign Up to continue</CardTitle>
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
        <form onSubmit={onPasswordSignUp} className='space-y-2.5'>
          <Input
            id='name'
            disabled={pending}
            value={name}
            onChange={(e) => {setName(e.target.value)}}
            placeholder='Full Name'
            required
          />
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
          <Input
            id='confirm'
            disabled={pending}
            value={confirmPassword}
            onChange={(e) => {setConfirmPassword(e.target.value)}}
            placeholder='Confirm Password'
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
            onClick={() => onProviderSignUp('google')}
            variant='outline'
            size='lg'
            className='w-full relative'
          >
            <FcGoogle className='size-5 absolute top-3 left-2.5' />
            Continue with Google
          </Button>
          <Button
            disabled={pending}
            onClick={() => onProviderSignUp('github')}
            variant='outline'
            size='lg'
            className='w-full relative'
          >
            <FaGithub className='size-5 absolute top-3 left-2.5' />
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
            Already have an account? <span onClick={() => setState('signIn')} className="text-sky-700 hover:underline cursor-pointer"> Sign In! </span>
        </p>
      </CardContent>
    </Card>
  );
};
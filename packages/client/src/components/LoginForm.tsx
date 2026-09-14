import { useState, type Dispatch, type SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
   setIsLoggedIn: Dispatch<SetStateAction<boolean | null>>;
};

export function LoginForm({ setIsLoggedIn }: Props) {
   const [mode, setMode] = useState<'login' | 'signup'>('login');
   const [open, setOpen] = useState(false);
   const [errorMessage, setErrorMessage] = useState('');

   async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
      event.preventDefault();
      setErrorMessage('');

      // get user data from the form
      const formData = new FormData(event.currentTarget);
      const userInputData = Object.fromEntries(formData.entries());

      if (
         mode === 'signup' &&
         userInputData.userPassword !== userInputData.confirmPassword
      ) {
         setErrorMessage('Password and Confirm password do not match');
         return;
      }

      const requestBody = {
         userID: userInputData.userID,
         userPassword: userInputData.userPassword,
      };

      const endpoint =
         mode === 'login' ? '/api/auth/login/' : '/api/auth/signup/';
      try {
         const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(requestBody),
         });

         const data = await response.json();

         // login, signup failure
         if (!response.ok) {
            setErrorMessage(data.message);
            return;
         }

         // login, signup success
         setIsLoggedIn(true);
         setOpen(false);
      } catch (error) {
         setErrorMessage('Something went wrong');
         console.error(error);
      }
   }

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button variant="outline">Login</Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-md">
            <form onSubmit={handleSubmit}>
               <DialogHeader>
                  <DialogTitle>
                     {mode === 'login' ? 'Login' : 'Create an account'}
                  </DialogTitle>
                  <DialogDescription>
                     {mode === 'login'
                        ? 'Enter your ID and password.'
                        : 'Enter your information to create an account.'}
                  </DialogDescription>
               </DialogHeader>
               <FieldGroup className="mt-6">
                  <Field>
                     <Label htmlFor="userID">ID</Label>
                     <Input
                        id="userID"
                        name="userID"
                        type="text"
                        placeholder="Enter your ID"
                        required
                     />
                  </Field>
                  <Field>
                     <Label htmlFor="userPassword">Password</Label>
                     <Input
                        id="userPassword"
                        name="userPassword"
                        type="password"
                        placeholder="Enter your password"
                        required
                     />
                  </Field>
                  {mode === 'signup' && (
                     <Field>
                        <Label htmlFor="confirmPassword">
                           Confirm password
                        </Label>
                        <Input
                           id="confirmPassword"
                           name="confirmPassword"
                           type="password"
                           placeholder="Enter your password again"
                           required
                        />
                     </Field>
                  )}
               </FieldGroup>
               <div className="mt-4 text-center text-sm">
                  {errorMessage && (
                     <p className="mt-4 text-sm text-destructive">
                        {errorMessage}
                     </p>
                  )}
                  {mode === 'login' ? (
                     <>
                        Don't have an account?{' '}
                        <Button
                           type="button"
                           variant="link"
                           className="h-auto p-0"
                           onClick={() => setMode('signup')}
                        >
                           Sign up
                        </Button>
                     </>
                  ) : (
                     <>
                        Already have an account?{' '}
                        <Button
                           type="button"
                           variant="link"
                           className="h-auto p-0"
                           onClick={() => setMode('login')}
                        >
                           Login
                        </Button>
                     </>
                  )}
               </div>
               <DialogFooter className="mt-6">
                  <DialogClose asChild>
                     <Button type="button" variant="outline">
                        Cancel
                     </Button>
                  </DialogClose>
                  <Button type="submit">
                     {mode === 'login' ? 'Login' : 'Sign up'}
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
}

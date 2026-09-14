import { useState, type Dispatch, type SetStateAction } from 'react';
import { IoGolf, IoShieldCheckmarkOutline } from 'react-icons/io5';
import { LoginForm } from './LoginForm';
import Logout from './Logout';

// const test = async () => {
//    const response = await fetch('/api/auth/logout', {
//       method: 'POST',
//       credentials: 'include',
//    });
//    const data = await response.json();
//    console.log(data);
// };

type Props = {
   isLoggedIn: boolean | null;
   setIsLoggedIn: Dispatch<SetStateAction<boolean | null>>;
   onLogout: () => void;
};

const NavBar = ({ isLoggedIn, setIsLoggedIn, onLogout }: Props) => {
   return (
      <header className="bg-background">
         <nav className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-6 lg:px-8">
            <a
               href="/"
               className="flex items-center gap-3"
               aria-label="Swing Lab home"
            >
               <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <IoGolf className="size-5" />
               </span>
               <span className="text-lg font-semibold tracking-tight">
                  Swing Lab
               </span>
            </a>

            <div className="flex items-center gap-3 sm:gap-5">
               <div className="hidden items-center gap-1.5 text-xs font-medium text-muted-foreground sm:flex">
                  <IoShieldCheckmarkOutline className="size-4" />
                  Secure upload
               </div>
               {isLoggedIn ? (
                  <Logout onLogout={onLogout} />
               ) : (
                  <LoginForm setIsLoggedIn={setIsLoggedIn} />
               )}
               {/* <button onClick={() => test()}>Test</button> */}
            </div>
         </nav>
      </header>
   );
};

export default NavBar;

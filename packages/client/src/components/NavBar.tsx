import { type Dispatch, type SetStateAction } from 'react';
import { IoShieldCheckmarkOutline } from 'react-icons/io5';
import { LoginForm } from './LoginForm';
import Logout from './Logout';

// consider using context
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
               aria-label="Swing Analyzer home"
            >
               <span className="flex size-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <img
                     src="/logo.svg"
                     alt="Golf Swing Analyzer"
                     className="w-8.5 h-8 brightness-0 invert"
                  />
               </span>
               <span className="text-lg font-semibold tracking-tight">
                  Swing Analyzer
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
            </div>
         </nav>
      </header>
   );
};

export default NavBar;

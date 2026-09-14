import { createContext, useContext, useState, type ReactNode } from 'react';

type LoginStatus = boolean | null;

interface AuthContextType {
   isLoggedIn: LoginStatus;
   setIsLoggedIn: (value: LoginStatus) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
   children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
   const [isLoggedIn, setIsLoggedIn] = useState<LoginStatus>(null);
   return (
      <AuthContext value={{ isLoggedIn, setIsLoggedIn }}>
         {children}
      </AuthContext>
   );
}

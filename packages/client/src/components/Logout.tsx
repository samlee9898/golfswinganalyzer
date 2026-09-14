import { Button } from './ui/button';

type Props = {
   onLogout: () => void;
};

// This button should log the user out
const Logout = ({ onLogout }: Props) => {
   return (
      <Button variant="outline" onClick={onLogout}>
         Logout
      </Button>
   );
};

export default Logout;

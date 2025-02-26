import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

export const useAuth = () => {
  const [user, loading] = useAuthState(auth);
  return { user, loading };
};

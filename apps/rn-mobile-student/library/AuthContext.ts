import { createContext } from "react";
import { AuthState } from "types";

export const AuthContext = createContext<{
  setAuth: React.Dispatch<React.SetStateAction<AuthState | null>>;
  auth: AuthState | null;
  isLoggedIn: boolean;
  loading: boolean;
  logout: () => void;
}>({
  setAuth: () => {},
  auth: null,
  isLoggedIn: false,
  loading: false,
  logout: () => {}
});

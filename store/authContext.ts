import { createContext } from "react";

const AuthContext = createContext({
  isConnected: false,
  signOut: () => {},
  connectUser: () => {},
});

export default AuthContext;

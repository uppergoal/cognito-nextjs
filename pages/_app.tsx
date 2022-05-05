import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import useAuthUser from "../hooks/useAuthUser";
import AuthContext from "../store/authContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const { isConnected, connectUser, signOut } = useAuthUser();

  return (
    <>
      <ChakraProvider>
        <AuthContext.Provider value={{ isConnected, connectUser, signOut }}>
          <Component {...pageProps} />
        </AuthContext.Provider>
      </ChakraProvider>
    </>
  );
}

export default MyApp;

import {
  Box,
  Button,
  Container,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import Head from "next/head";
import { useContext, useState } from "react";
import AuthForgot from "../../components/AuthForgot";
import AuthLogin from "../../components/AuthLogin";
import AuthRegister from "../../components/AuthRegister";
import AuthVerifyAlert from "../../components/AuthVerifyAlert";
import AuthContext from "../../store/authContext";

export interface AuthProps {
  verifyHandler: (username: string, password: string) => void;
}

interface Credentials {
  username: string;
  password: string;
}

export default function Home() {
  const { isConnected, signOut } = useContext(AuthContext);
  const [credendials, setCredentials] = useState<Credentials>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const showVerifyHandler = (username: string, password: string) => {
    setCredentials({ username, password });
    onOpen();
  };

  // TODO: Validate the username to check if unique

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Container mt={10}>
          {!isConnected ? (
            <>
              <AuthVerifyAlert
                onClose={onClose}
                isOpen={isOpen}
                credentials={credendials}
              />

              <AuthRegister verifyHandler={showVerifyHandler} />
              <Spacer mt={10} />
              <AuthLogin verifyHandler={showVerifyHandler} />
              <Spacer mt={10} />
              <AuthForgot />
            </>
          ) : (
            <>
              <Box>You are connected</Box>
              <Button onClick={signOut}>Sign Out</Button>
            </>
          )}
        </Container>
      </main>
    </div>
  );
}
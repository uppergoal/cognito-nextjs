import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Heading,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { ChangeEvent, useContext, useState } from "react";
import { userPool } from "../lib/cognito";
import { AuthProps } from "../pages/auth";
import AuthContext from "../store/authContext";

const AuthLogin = ({ verifyHandler }: AuthProps) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { connectUser } = useContext(AuthContext);

  const toast = useToast();

  const submitHandler = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const username = event.target.username.value;
    const password = event.target.password.value;

    const authData = {
      Username: username,
      Password: password,
    };

    const authDetails = new AuthenticationDetails(authData);

    const userData = {
      Username: username,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: () => {
        setLoading(false);
        toast({
          title: "Connected 😎",
          status: "success",
          isClosable: true,
        });
        connectUser();
      },
      onFailure: (err) => {
        if (err.code === "UserNotConfirmedException") {
          cognitoUser.resendConfirmationCode((err, result) => {
            if (err) {
              setError(err.message);
              return;
            }
            localStorage.setItem("username", username);
            toast({
              title: `${result.CodeDeliveryDetails.AttributeName} sent`,
              status: "success",
              isClosable: true,
            });
            verifyHandler(username, password);
            return;
          });
        } else {
          setLoading(false);
          setError(err.message);
        }
      },
    });
  };

  return (
    <Box
      borderRadius="lg"
      p={6}
      border="1px"
      borderColor="gray.200"
      shadow="md"
    >
      <Heading as="h1" size="md">
        Login
      </Heading>

      <form onSubmit={submitHandler} onChange={() => setError(null)}>
        <Stack mt={4} spacing={4}>
          <Input name="username" required placeholder="Username" />
          <Input
            name="password"
            type="password"
            required
            placeholder="Password"
          />
          <Button isLoading={loading} type="submit" colorScheme="purple">
            Connect
          </Button>

          {error && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>Oups!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </Stack>
      </form>
    </Box>
  );
};

export default AuthLogin;

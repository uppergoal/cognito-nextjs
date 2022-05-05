import {
  Box,
  Button,
  Heading,
  HStack,
  Input,
  PinInput,
  PinInputField,
  Stack,
  useToast,
} from "@chakra-ui/react";
import {
  AuthenticationDetails,
  CognitoUser,
  IAuthenticationDetailsData,
  ICognitoUserData,
} from "amazon-cognito-identity-js";
import { useRouter } from "next/router";
import { ChangeEvent, useContext, useState } from "react";
import { userPool } from "../lib/cognito";
import AuthContext from "../store/authContext";

const AuthForgot = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [username, setUsername] = useState<string>();
  const [code, setCode] = useState<string>();

  const toast = useToast();
  const router = useRouter();
  const { connectUser } = useContext(AuthContext);

  const submitHandler = (event: ChangeEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();
    const u = event.target.username.value;
    setUsername(u);

    const userData = {
      Username: u,
      Pool: userPool,
    } as ICognitoUserData;

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.forgotPassword({
      onSuccess: (result) => {
        toast({
          title: `${result.CodeDeliveryDetails.AttributeName} sent`,
          status: "success",
          isClosable: true,
        });
        setSubmitted(true);
        setLoading(false);
      },
      onFailure: (err) => {
        toast({
          title: `Error`,
          description: err.message,
          status: "error",
          isClosable: true,
        });
        setLoading(false);
      },
    });
  };

  const confirmHandler = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!code) return;

    const newPassword = event.target.newPassword.value;
    const userData = {
      Username: username,
      Pool: userPool,
    } as ICognitoUserData;

    const cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmPassword(code, newPassword, {
      onSuccess: (result) => {
        const authData = {
          Username: username,
          Password: newPassword,
        } as IAuthenticationDetailsData;

        const authDetails = new AuthenticationDetails(authData);

        cognitoUser.authenticateUser(authDetails, {
          onSuccess: () => {
            toast({
              title: "Password changed and you are connected 😎",
              status: "success",
              isClosable: true,
            });
            setLoading(false);
            connectUser();
          },
          onFailure: (err) => {
            toast({
              title: `Success 😌`,
              description:
                "Password changed. Please login with your new password",
              status: "success",
              isClosable: true,
            });
            router.push("/auth");
          },
        });
        setLoading(false);
      },
      onFailure: (err) => {
        toast({
          title: `Error`,
          description: err.message,
          status: "error",
          isClosable: true,
        });
        setLoading(false);
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
        Forgot Password
      </Heading>

      {!submitted ? (
        <form onSubmit={submitHandler}>
          <Stack mt={4} spacing={4}>
            <Input name="username" required placeholder="Username" />
            <Button isLoading={loading} type="submit" colorScheme="pink">
              Submit
            </Button>
          </Stack>
        </form>
      ) : (
        <form onSubmit={confirmHandler}>
          <Stack mt={4} spacing={4}>
            <HStack mt={6}>
              <PinInput otp onComplete={(val) => setCode(val)}>
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
            </HStack>
            <Input
              name="newPassword"
              required
              type="password"
              placeholder="New Password"
            />
            <Button isLoading={loading} type="submit" colorScheme="pink">
              Submit
            </Button>
          </Stack>
        </form>
      )}
    </Box>
  );
};

export default AuthForgot;

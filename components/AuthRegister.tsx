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
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { ChangeEvent, useState } from "react";
import { userPool } from "../lib/cognito";
import { AuthProps } from "../pages/auth";

const AuthRegister = ({ verifyHandler }: AuthProps) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const toast = useToast();

  const submitHandler = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const attrsList: CognitoUserAttribute[] = [];
    const email = event.target.email.value;
    const phone = event.target.phone.value;
    const username = event.target.username.value;
    const password = event.target.password.value;

    const dataEmail = { Name: "email", Value: email };
    attrsList.push(new CognitoUserAttribute(dataEmail));

    if (phone) {
      const dataPhoneNumber = { Name: "phone_number", Value: phone };
      attrsList.push(new CognitoUserAttribute(dataPhoneNumber));
    }

    userPool.signUp(
      username,
      password,
      attrsList,
      [],
      (err: any, result: any) => {
        if (err) {
          setError(err.message);
          return;
        }
        if (!result) {
          setError("Something went wrong");
          return;
        }
        localStorage.setItem("username", result.user.getUsername());
        toast({
          title: `${result?.CodeDeliveryDetails?.AttributeName || "Code"} sent`,
          status: "success",
          isClosable: true,
        });
        setLoading(false);
        verifyHandler(username, password);
      }
    );
  };

  return (
    <>
      <Box
        borderRadius="lg"
        p={6}
        border="1px"
        borderColor="gray.200"
        shadow="md"
      >
        <Heading as="h1" size="md">
          Register
        </Heading>

        <form onSubmit={submitHandler} onChange={() => setError(null)}>
          <Stack mt={4} spacing={4}>
            <Input name="username" required placeholder="Username" />
            <Input name="email" required placeholder="Email" />
            <Input name="phone" placeholder="Phone Number" />
            <Input
              name="password"
              type="password"
              required
              placeholder="Password"
            />
            <Button type="submit" colorScheme="blue" isDisabled={loading}>
              Register
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
    </>
  );
};

export default AuthRegister;

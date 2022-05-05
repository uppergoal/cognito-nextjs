import {
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertIcon,
  AlertTitle,
  Button,
  HStack,
  PinInput,
  PinInputField,
  useToast,
} from "@chakra-ui/react";
import {
  AuthenticationDetails,
  CognitoUser,
  IAuthenticationDetailsData,
  ICognitoUserData,
} from "amazon-cognito-identity-js";
import { useRouter } from "next/router";
import { useContext, useRef, useState } from "react";
import { userPool } from "../lib/cognito";
import AuthContext from "../store/authContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  credentials?: {
    username: string;
    password: string;
  };
}

const AuthVerifyAlert = ({ isOpen, credentials, onClose }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const cancelRef = useRef<any>();
  const toast = useToast();
  const { connectUser } = useContext(AuthContext);

  const validateHandler = (code: string) => {
    setLoading(true);

    const userData = {
      Username: credentials?.username,
      Pool: userPool,
    } as ICognitoUserData;

    const cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        toast({ title: "Error", description: err.message, status: "error" });
        setLoading(false);
        return;
      }

      if (!credentials?.password || !credentials?.username) {
        toast({
          title: "Great 👍",
          description: "You are verified, please login to access your account.",
          status: "success",
        });
        setLoading(false);
        return;
      }

      const authData = {
        Username: credentials?.username,
        Password: credentials?.password,
      } as IAuthenticationDetailsData;
      const authDetails = new AuthenticationDetails(authData);

      cognitoUser.authenticateUser(authDetails, {
        onSuccess: () => {
          connectUser();
          toast({ title: "Connected 😎", status: "success" });
          router.push("/");
        },
        onFailure: (err) => {
          toast({ title: "Error", description: err.message, status: "error" });
          router.push("/auth");
        },
      });
    });
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      leastDestructiveRef={cancelRef}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>Verify your account</AlertDialogHeader>

          <AlertDialogBody>
            <HStack mt={6}>
              <PinInput
                otp
                isDisabled={loading}
                size="lg"
                onComplete={validateHandler}
              >
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
            </HStack>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button variant="ghost" ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default AuthVerifyAlert;

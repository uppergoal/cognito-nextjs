import { CognitoUserSession } from "amazon-cognito-identity-js";
import { useCallback, useEffect, useState } from "react";
import { userPool } from "../lib/cognito";

interface User {
  [key: string]: string;
}

export default function useAuthUser() {
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState<User>();

  const signOut = () => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
      setIsConnected(false);
    }
  };

  const connectUser = useCallback(() => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.getSession((err: any, session: CognitoUserSession) => {
        if (err) {
          console.error(err);
          return;
        }

        cognitoUser.getUserAttributes((err: any, result: any) => {
          if (err) {
            signOut();
            return;
          }
          const u = {} as User;
          for (let i = 0; i < result.length; i++) {
            u[result[i].getName()] = result[i].getValue();
          }
          setUser(u);
          setIsConnected(session.isValid());
        });
      });
    }
  }, []);

  useEffect(() => {
    connectUser();
  }, [connectUser]);

  return { isConnected, user, connectUser, signOut };
}

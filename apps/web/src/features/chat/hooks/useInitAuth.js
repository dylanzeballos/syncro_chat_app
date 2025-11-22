import { useEffect, useRef } from "react";
import { useSyncUserMutation } from "./useUserQueries";

export function useInitAuth({
  user,
  authLoading,
  getValidToken,
  setToken,
  signOut,
}) {
  const { mutate: syncUser, isLoading: isSyncingUser } = useSyncUserMutation();
  const syncedRef = useRef(false);

  useEffect(() => {
    const initTokenAndUser = async () => {
      if (user && !authLoading && !syncedRef.current) {
        syncedRef.current = true;
        try {
          const validToken = await getValidToken();
          setToken(validToken);

          syncUser(undefined, {
            onError: (error) => {
              console.error("Error sincronizando usuario:", error);
              syncedRef.current = false;
              signOut();
            },
          });
        } catch (error) {
          console.error("Error en inicialización de auth:", error);
          syncedRef.current = false;
          signOut();
        }
      }
    };

    initTokenAndUser();
  }, [user, authLoading, getValidToken, setToken, signOut, syncUser]);

  return { isSyncingUser };
}

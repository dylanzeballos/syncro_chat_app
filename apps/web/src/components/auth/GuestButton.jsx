import { useState } from "react";
import { Button } from "../ui/Button";
import { UserIcon } from "../icons";
import { supabase } from "../../config/supabase";

export const GuestButton = ({ text = "Continuar como Invitado", onError }) => {
  const [loading, setLoading] = useState(false);

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      const guestUsername = `Invitado_${Math.random()
        .toString(36)
        .substr(2, 6)}`;

      const { data, error } = await supabase.auth.signInAnonymously({
        options: {
          data: {
            username: guestUsername,
            is_guest: true,
          },
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error("Guest login error:", error);
      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      fullWidth
      icon={UserIcon}
      loading={loading}
      onClick={handleGuestLogin}
    >
      {text}
    </Button>
  );
};

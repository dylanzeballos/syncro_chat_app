import { Button } from "../ui/Button";
import { GoogleIcon } from "../icons";
import { supabase } from "../../config/supabase";

export const GoogleButton = ({
  text = "Continuar con Google",
  loading = false,
  onSuccess,
  onError,
}) => {
  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) throw error;

      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error) {
      console.error("Google login error:", error);
      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <Button
      type="button"
      variant="google"
      fullWidth
      icon={GoogleIcon}
      loading={loading}
      onClick={handleGoogleLogin}
    >
      {text}
    </Button>
  );
};

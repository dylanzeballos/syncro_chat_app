import { useState } from "react";
import { GoogleButton, GuestButton } from "../../../components/auth";
import { Divider } from "../../../components/ui";
import syncroLogo from "../../../assets/syncroLogoWhite.png";

export default function LoginPage() {
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background transition-colors duration-300">
      <div className="p-8 rounded-2xl shadow-xl w-full max-w-md bg-surface transition-colors duration-300">
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 mb-4 flex items-center justify-center">
            <img
              src={syncroLogo}
              alt="Syncro Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-text">
            Bienvenido a Syncro
          </h1>
          <p className="text-text-muted">Elige como te gustaría continuar</p>
        </div>

        {error && (
          <div className="mb-6 border px-4 py-3 rounded-lg text-sm bg-red-100 border-red-200 text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <GoogleButton
            text="Continuar con Google"
            onError={(err) => setError(err.message)}
          />

          <Divider text="O" />

          <GuestButton
            text="Continuar como Invitado"
            onError={(err) => setError(err.message)}
          />
        </div>

      </div>
    </div>
  );
}

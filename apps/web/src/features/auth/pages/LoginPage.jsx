import { useState } from "react";
import { GoogleButton, GuestButton } from "../../../components/auth";
import { Divider } from "../../../components/ui";
import reactLogo from "../../../assets/react.svg";

export default function LoginPage() {
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 mb-4 flex items-center justify-center">
            {/* Imagen del logo - cambiar reactLogo por tu logo */}
            <img 
              src={reactLogo} 
              alt="Syncro Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenido a Syncro
          </h1>
          <p className="text-gray-600">Elige como te gustaría continuar</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Login Options */}
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

        {/* Footer Note */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Continuando, aceptas nuestros Términos de Servicio y Política de Privacidad
        </p>
      </div>
    </div>
  );
}

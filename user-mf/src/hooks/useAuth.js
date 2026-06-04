import { useCallback, useState } from "react";
import { login, register } from "../api/authApi.js";

export function useAuth({ onAuthenticated } = {}) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const submit = useCallback(
    async (event) => {
      event.preventDefault();
      setLoading(true);
      setError("");
      setUser(null);

      try {
        const action = mode === "login" ? login : register;
        const authenticated = await action(email.trim(), password);
        if (!authenticated?.email) {
          throw new Error("Invalid response from user service");
        }
        if (onAuthenticated) {
          onAuthenticated(authenticated);
        } else {
          setUser(authenticated);
        }
      } catch (err) {
        setError(err.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [mode, email, password, onAuthenticated],
  );

  const switchMode = useCallback((next) => {
    setMode(next);
    setError("");
    setUser(null);
  }, []);

  return {
    mode,
    email,
    password,
    loading,
    error,
    user,
    setEmail,
    setPassword,
    submit,
    switchMode,
  };
}

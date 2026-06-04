import { useAuth } from "../../hooks/useAuth.js";
import { AuthForm } from "../AuthForm/AuthForm.jsx";
import "./UserAuth.css";

/**
 * Root UI for the user microfrontend (login / register).
 */
export function UserAuth({ onAuthenticated }) {
  const {
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
  } = useAuth({ onAuthenticated });

  return (
    <div className="user-auth">
      <header className="user-auth__header">
        <div className="user-auth__header-inner">
          <span className="user-auth__logo">shop</span>
          <span className="user-auth__tagline">Account</span>
        </div>
      </header>

      <main className="user-auth__main">
        <div className="user-auth__card">
          {user ? (
            <div className="user-auth__success">
              <h2>
                {mode === "login" ? "Welcome back" : "Account created"}
              </h2>
              <p className="user-auth__email">
                Signed in as <strong>{user.email ?? email}</strong>
              </p>
              {user.id != null && (
                <p className="user-auth__meta">User ID: {user.id}</p>
              )}
              <button
                type="button"
                className="user-auth__sign-out"
                onClick={() => window.location.reload()}
              >
                Sign out
              </button>
            </div>
          ) : (
            <AuthForm
              mode={mode}
              email={email}
              password={password}
              loading={loading}
              error={error}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onSubmit={submit}
              onSwitchMode={switchMode}
            />
          )}
        </div>
      </main>
    </div>
  );
}

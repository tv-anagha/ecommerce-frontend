import "./AuthForm.css";

export function AuthForm({
  mode,
  email,
  password,
  loading,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onSwitchMode,
}) {
  const isLogin = mode === "login";

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <h2 className="auth-form__heading">
        {isLogin ? "Sign in" : "Create account"}
      </h2>

      <label className="auth-form__label" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        className="auth-form__input"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        required
      />

      <label className="auth-form__label" htmlFor="password">
        Password
      </label>
      <input
        id="password"
        className="auth-form__input"
        type="password"
        name="password"
        autoComplete={isLogin ? "current-password" : "new-password"}
        placeholder="Enter your password"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        minLength={6}
        required
      />

      {error && (
        <p className="auth-form__error" role="alert">
          {error}
          <span className="auth-form__error-hint">
            User-service: POST /users/login (sign in) or POST /register (create account).
          </span>
        </p>
      )}

      <button type="submit" className="auth-form__submit" disabled={loading}>
        {loading
          ? "Please wait…"
          : isLogin
            ? "Sign in"
            : "Create your account"}
      </button>

      <p className="auth-form__switch">
        {isLogin ? (
          <>
            New to Shop?{" "}
            <button
              type="button"
              className="auth-form__link"
              onClick={() => onSwitchMode("register")}
            >
              Create your account
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              type="button"
              className="auth-form__link"
              onClick={() => onSwitchMode("login")}
            >
              Sign in
            </button>
          </>
        )}
      </p>
    </form>
  );
}

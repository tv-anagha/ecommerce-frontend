import { useState } from "react";
import { ProductCatalog } from "@product-mf/components/ProductCatalog/ProductCatalog.jsx";
import { UserAuth } from "@user-mf/components/UserAuth/UserAuth.jsx";
import { clearSession, loadSession, saveSession } from "./auth/session.js";
import "./App.css";

function App() {
  const [user, setUser] = useState(() => loadSession());

  const handleAuthenticated = (authenticatedUser) => {
    saveSession(authenticatedUser);
    setUser(authenticatedUser);
  };

  const handleSignOut = () => {
    clearSession();
    setUser(null);
  };

  if (!user) {
    return <UserAuth onAuthenticated={handleAuthenticated} />;
  }

  return (
    <ProductCatalog
      user={user}
      onSignOut={handleSignOut}
      autoLoad
    />
  );
}

export default App;

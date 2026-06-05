import { useState } from "react";
import { CartBadge } from "@cart-mf/components/CartBadge/CartBadge.jsx";
import { CartPanel } from "@cart-mf/components/CartPanel/CartPanel.jsx";
import { useCart } from "@cart-mf/hooks/useCart.js";
import { ProductCatalog } from "@product-mf/components/ProductCatalog/ProductCatalog.jsx";
import { UserAuth } from "@user-mf/components/UserAuth/UserAuth.jsx";
import { clearSession, loadSession, saveSession } from "./auth/session.js";
import "./App.css";

function AuthenticatedApp({ user, onSignOut }) {
  const {
    items,
    itemCount,
    cartLoading,
    addingProductId,
    removingProductId,
    isOpen,
    error: cartError,
    addToCart,
    removeFromCart,
    openCart,
    closeCart,
    clearError,
  } = useCart(user);

  const handleCheckout = () => {
    alert("Checkout microfrontend coming in the next sprint.");
  };

  return (
    <ProductCatalog
      user={user}
      onSignOut={onSignOut}
      autoLoad
      cartCount={itemCount}
      cartLoading={cartLoading}
      cartError={cartError}
      onClearCartError={clearError}
      onAddToCart={addToCart}
      addingProductId={addingProductId}
      CartBadge={CartBadge}
      onOpenCart={openCart}
      CartPanel={CartPanel}
      cartItems={items}
      cartPanelOpen={isOpen}
      onCloseCart={closeCart}
      onRemoveFromCart={removeFromCart}
      removingProductId={removingProductId}
      onCheckout={handleCheckout}
    />
  );
}

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

  return <AuthenticatedApp user={user} onSignOut={handleSignOut} />;
}

export default App;

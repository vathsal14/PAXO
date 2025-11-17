// Shopping cart utility functions

export function getCart() {
  if (typeof window === "undefined") return [];

  try {
    const cart = localStorage.getItem("paxo_cart");
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("Error loading cart:", error);
    return [];
  }
}

export function saveCart(cart) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("paxo_cart", JSON.stringify(cart));
    // Trigger cart update event
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: cart }));
  } catch (error) {
    console.error("Error saving cart:", error);
  }
}

export function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.subtotal = existingItem.quantity * existingItem.unit_price;
  } else {
    cart.push({
      id: product.id,
      product_id: product.id,
      product_name: product.name,
      quantity: quantity,
      unit_price: parseFloat(product.price ?? 0),
      subtotal: quantity * parseFloat(product.price ?? 0),
      image_url: product.image_url,
      sku: product.sku,
      unit: product.unit,
      pack_quantity: product.pack_quantity,
    });
  }

  saveCart(cart);
  return cart;
}

export function removeFromCart(productId) {
  const cart = getCart();
  const updatedCart = cart.filter((item) => item.id !== productId);
  saveCart(updatedCart);
  return updatedCart;
}

export function updateCartItemQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find((item) => item.id === productId);

  if (item) {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    item.quantity = quantity;
    item.subtotal = item.quantity * item.unit_price;
    saveCart(cart);
  }

  return cart;
}

export function clearCart() {
  if (typeof window === "undefined") return;

  localStorage.removeItem("paxo_cart");
  window.dispatchEvent(new CustomEvent("cartUpdated", { detail: [] }));
}

export function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.subtotal, 0);
}

export function getCartItemCount() {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
}

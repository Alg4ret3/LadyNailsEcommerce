/**
 * Utility module for generating namespaced localStorage keys for cart isolation.
 * 
 * Each user (including guests) gets their own set of keys:
 *   - medusa_cart_id__guest       → carrito de invitado
 *   - medusa_cart_id__cus_01ABC   → carrito del usuario ABC
 *   - ladynail-cart__guest        → items locales del invitado
 *   - ladynail-cart__cus_01ABC    → items locales del usuario ABC
 */

const CART_ID_PREFIX = 'medusa_cart_id';
const CART_ITEMS_PREFIX = 'ladynail-cart';
const LEGACY_CART_ID_KEY = 'medusa_cart_id';
const LEGACY_CART_ITEMS_KEY = 'ladynail-cart';

function getSuffix(userId: string | null): string {
  return userId ? `__${userId}` : '__guest';
}

export function getCartIdKey(userId: string | null): string {
  return `${CART_ID_PREFIX}${getSuffix(userId)}`;
}

export function getCartItemsKey(userId: string | null): string {
  return `${CART_ITEMS_PREFIX}${getSuffix(userId)}`;
}

/**
 * Migrate legacy keys (without suffix) to guest-namespaced keys.
 * Should be called once on app init to handle existing users who had
 * carts stored under the old global keys.
 */
export function migrateLegacyCartKeys(): void {
  if (typeof window === 'undefined') return;

  const legacyCartId = localStorage.getItem(LEGACY_CART_ID_KEY);
  const legacyCartItems = localStorage.getItem(LEGACY_CART_ITEMS_KEY);

  const guestCartIdKey = getCartIdKey(null);
  const guestCartItemsKey = getCartItemsKey(null);

  // Only migrate if legacy keys exist AND new guest keys don't
  if (legacyCartId && !localStorage.getItem(guestCartIdKey)) {
    localStorage.setItem(guestCartIdKey, legacyCartId);
  }

  if (legacyCartItems && !localStorage.getItem(guestCartItemsKey)) {
    localStorage.setItem(guestCartItemsKey, legacyCartItems);
  }

  // Clean up legacy keys (they now have no suffix, which would conflict)
  // Only remove if the key is exactly the prefix (no suffix)
  if (legacyCartId && !legacyCartId.startsWith(CART_ID_PREFIX + '__')) {
    localStorage.removeItem(LEGACY_CART_ID_KEY);
  }
  if (legacyCartItems) {
    localStorage.removeItem(LEGACY_CART_ITEMS_KEY);
  }
}

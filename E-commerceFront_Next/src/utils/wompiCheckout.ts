/** sessionStorage key: Medusa cart id active when user opened Wompi checkout */
export const WOMPI_CHECKOUT_CART_KEY = 'wompi_checkout_cart_id';
/** sessionStorage key: Wompi payment reference tied to the Medusa payment session */
export const WOMPI_CHECKOUT_REF_KEY = 'wompi_checkout_reference';

export const WOMPI_RETURN_PATH = '/checkout/wompi-return';

export function getWompiReturnParams(): { txId: string | null; ref: string | null } {
  if (typeof window === 'undefined') return { txId: null, ref: null };
  const params = new URLSearchParams(window.location.search);
  return {
    txId: params.get('id'),
    ref: params.get('wompi_ref'),
  };
}

export function hasWompiReturnInUrl(): boolean {
  const { txId, ref } = getWompiReturnParams();
  return !!(txId || ref);
}

export function persistWompiCheckoutCartId(cartId: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(WOMPI_CHECKOUT_CART_KEY, cartId);
}

export function getPersistedWompiCheckoutCartId(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(WOMPI_CHECKOUT_CART_KEY);
}

export function clearPersistedWompiCheckoutCartId(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(WOMPI_CHECKOUT_CART_KEY);
  sessionStorage.removeItem(WOMPI_CHECKOUT_REF_KEY);
}

export function persistWompiCheckoutReference(reference: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(WOMPI_CHECKOUT_REF_KEY, reference);
}

export function getPersistedWompiCheckoutReference(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(WOMPI_CHECKOUT_REF_KEY);
}

import { AbandonedCart, AbandonedCartItem } from '../types';

export const ABANDONED_CARTS_STORAGE_KEY = 'banglaxpress_abandoned_carts';

// Helper to get all abandoned carts
export function getStoredAbandonedCarts(): AbandonedCart[] {
  try {
    const raw = localStorage.getItem(ABANDONED_CARTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Failed to parse abandoned carts from storage:', err);
  }

  // Initial realistic sample data representing abandoned checkouts for demonstration
  const initialSamples: AbandonedCart[] = [
    {
      id: 'AB-84912',
      email: 'niloyrajib@gmail.com',
      customerName: 'Niloy Rajib',
      phone: '01712894561',
      cityDivision: 'Inside Dhaka',
      items: [
        {
          productId: '1',
          name: 'T900 Ultra 2 Smartwatch Series 9 (Big 2.09 Display)',
          image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&q=80',
          price: 1450,
          quantity: 1,
          color: 'Orange'
        },
        {
          productId: '3',
          name: 'Fast Magnetic Wireless Car Charger 15W Qi Air Vent Mount',
          image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&q=80',
          price: 1150,
          quantity: 1,
          color: 'Matte Black'
        }
      ],
      subtotal: 2600,
      createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
      lastActiveAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      recoveryStatus: 'unrecovered',
      recoveryEmailCount: 0
    },
    {
      id: 'AB-84905',
      email: 'sadia.islam@dhakamail.com',
      customerName: 'Sadia Islam',
      phone: '01892113344',
      cityDivision: 'Outside Dhaka',
      items: [
        {
          productId: '4',
          name: 'Baseus 65W GaN Fast Charger Multi-Port Power Delivery',
          image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=400&q=80',
          price: 2450,
          quantity: 1
        }
      ],
      subtotal: 2450,
      createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hrs ago
      lastActiveAt: new Date(Date.now() - 1000 * 60 * 165).toISOString(),
      recoveryStatus: 'email_sent',
      emailSentAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      recoveryEmailCount: 1,
      recoveryCouponCode: 'RECOVER10',
      recoveryDiscountPercent: 10
    },
    {
      id: 'AB-84882',
      email: 'tareq.mahmood@yahoo.com',
      customerName: 'Tareq Mahmood',
      phone: '01611778899',
      cityDivision: 'Inside Dhaka',
      items: [
        {
          productId: '2',
          name: 'Wireless Bluetooth 5.3 ANC Noise Cancelling Earbuds',
          image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80',
          price: 1850,
          quantity: 2,
          color: 'Midnight Black'
        }
      ],
      subtotal: 3700,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hrs ago
      lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 17).toISOString(),
      recoveryStatus: 'unrecovered',
      recoveryEmailCount: 0
    }
  ];

  try {
    localStorage.setItem(ABANDONED_CARTS_STORAGE_KEY, JSON.stringify(initialSamples));
  } catch (err) {
    console.error(err);
  }
  return initialSamples;
}

// Log or update customer's email and cart details during checkout
export function recordAbandonedCheckout(params: {
  email: string;
  customerName?: string;
  phone?: string;
  cityDivision?: string;
  items: AbandonedCartItem[];
  subtotal: number;
}): AbandonedCart {
  const currentCarts = getStoredAbandonedCarts();
  const normalizedEmail = params.email.trim().toLowerCase();

  // Look for existing unrecovered record for this email
  const existingIdx = currentCarts.findIndex(
    (c) => c.email.toLowerCase() === normalizedEmail && c.recoveryStatus !== 'recovered'
  );

  let targetCart: AbandonedCart;

  if (existingIdx >= 0) {
    // Update existing checkout attempt
    targetCart = {
      ...currentCarts[existingIdx],
      customerName: params.customerName || currentCarts[existingIdx].customerName,
      phone: params.phone || currentCarts[existingIdx].phone,
      cityDivision: params.cityDivision || currentCarts[existingIdx].cityDivision,
      items: params.items.length > 0 ? params.items : currentCarts[existingIdx].items,
      subtotal: params.subtotal > 0 ? params.subtotal : currentCarts[existingIdx].subtotal,
      lastActiveAt: new Date().toISOString()
    };
    currentCarts[existingIdx] = targetCart;
  } else {
    // Create new record
    const randId = `AB-${Math.floor(10000 + Math.random() * 90000)}`;
    targetCart = {
      id: randId,
      email: normalizedEmail,
      customerName: params.customerName?.trim() || undefined,
      phone: params.phone?.trim() || undefined,
      cityDivision: params.cityDivision || 'Inside Dhaka',
      items: params.items,
      subtotal: params.subtotal,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      recoveryStatus: 'unrecovered',
      recoveryEmailCount: 0
    };
    currentCarts.unshift(targetCart);
  }

  try {
    localStorage.setItem(ABANDONED_CARTS_STORAGE_KEY, JSON.stringify(currentCarts));
    // Trigger window event for live admin updates
    window.dispatchEvent(new CustomEvent('abandoned_carts_updated', { detail: currentCarts }));
  } catch (err) {
    console.error(err);
  }

  return targetCart;
}

// Mark cart as recovered once an order has been successfully placed with this email/phone
export function markCartAsRecovered(emailOrPhone: string): void {
  const currentCarts = getStoredAbandonedCarts();
  const target = emailOrPhone.trim().toLowerCase();
  let updated = false;

  const newList = currentCarts.map((cart) => {
    if (
      cart.recoveryStatus !== 'recovered' &&
      (cart.email.toLowerCase() === target || (cart.phone && cart.phone.includes(target)))
    ) {
      updated = true;
      return {
        ...cart,
        recoveryStatus: 'recovered' as const
      };
    }
    return cart;
  });

  if (updated) {
    try {
      localStorage.setItem(ABANDONED_CARTS_STORAGE_KEY, JSON.stringify(newList));
      window.dispatchEvent(new CustomEvent('abandoned_carts_updated', { detail: newList }));
    } catch (err) {
      console.error(err);
    }
  }
}

// Update recovery email status when an email is sent
export function recordRecoveryEmailSent(cartId: string, couponCode?: string, discountPct?: number): AbandonedCart | null {
  const currentCarts = getStoredAbandonedCarts();
  const idx = currentCarts.findIndex((c) => c.id === cartId);
  if (idx < 0) return null;

  const updated: AbandonedCart = {
    ...currentCarts[idx],
    recoveryStatus: 'email_sent',
    emailSentAt: new Date().toISOString(),
    recoveryEmailCount: (currentCarts[idx].recoveryEmailCount || 0) + 1,
    recoveryCouponCode: couponCode || currentCarts[idx].recoveryCouponCode || 'RECOVER10',
    recoveryDiscountPercent: discountPct || currentCarts[idx].recoveryDiscountPercent || 10
  };

  currentCarts[idx] = updated;
  try {
    localStorage.setItem(ABANDONED_CARTS_STORAGE_KEY, JSON.stringify(currentCarts));
    window.dispatchEvent(new CustomEvent('abandoned_carts_updated', { detail: currentCarts }));
  } catch (err) {
    console.error(err);
  }
  return updated;
}

// Utility for managing installed Apps & Extensions (bKash, Nagad, Pathao, Steadfast, SMS)
// Allows admin to Enable/Disable apps from the Shop Admin Panel and reflects instantly in Fast Express Checkout

export interface InstalledApp {
  id: string;
  name: string;
  category: string;
  description: string;
  status: 'Connected' | 'Configuring' | 'Disabled';
  iconBg: string;
  iconText: string;
  apiKey: string;
  endpoint: string;
  live: boolean;
  enabled?: boolean;
}

export const INSTALLED_APPS_STORAGE_KEY = 'banglaxpress_installed_apps';
export const INSTALLED_APPS_UPDATED_EVENT = 'installed_apps_updated';

export const DEFAULT_INSTALLED_APPS: InstalledApp[] = [
  {
    id: 'app-bkash',
    name: 'bKash Merchant Checkout API',
    category: 'Payments',
    description: 'Accept seamless bKash payments directly in Bangladeshi Taka with instant tokenized validation.',
    status: 'Connected',
    iconBg: 'bg-[#D12053]',
    iconText: 'bK',
    apiKey: 'bK_live_app_key_88391047291',
    endpoint: 'https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout',
    live: true,
    enabled: true
  },
  {
    id: 'app-nagad',
    name: 'Nagad Gateway Integration',
    category: 'Payments',
    description: 'Official Nagad direct payment gateway with instant transaction verification.',
    status: 'Connected',
    iconBg: 'bg-[#F7931E]',
    iconText: 'Ng',
    apiKey: 'nagad_live_key_992019482',
    endpoint: 'https://api.mynagad.com/api/dfs/check-out/initialize',
    live: true,
    enabled: true
  },
  {
    id: 'app-pathao',
    name: 'Pathao Courier Automated Logistics',
    category: 'Shipping & Fulfillment',
    description: 'Auto-generates parcel tracking numbers, schedules pickup requests, and updates delivery statuses.',
    status: 'Connected',
    iconBg: 'bg-[#E41E26]',
    iconText: 'Pt',
    apiKey: 'pt_client_8492019482',
    endpoint: 'https://courier-api.pathao.com/aladdin/api/v1/orders',
    live: true,
    enabled: true
  },
  {
    id: 'app-steadfast',
    name: 'Steadfast Courier API',
    category: 'Shipping & Fulfillment',
    description: 'Integrated with Steadfast for nationwide fast Cash on Delivery order dispatches.',
    status: 'Connected',
    iconBg: 'bg-emerald-600',
    iconText: 'St',
    apiKey: 'sf_live_key_99381029482710',
    endpoint: 'https://portal.steadfast.com.bd/api/v1/create_order',
    live: true,
    enabled: true
  },
  {
    id: 'app-sms',
    name: 'Greenweb & Alpha SMS Gateway',
    category: 'Marketing & SMS',
    description: 'Sends real-time order confirmation SMS, dispatch alerts, and OTP verifications to customers.',
    status: 'Connected',
    iconBg: 'bg-blue-600',
    iconText: 'SMS',
    apiKey: 'gw_token_9918237194829104',
    endpoint: 'https://api.greenweb.com.bd/api.php',
    live: true,
    enabled: true
  }
];

export function getInstalledApps(): InstalledApp[] {
  if (typeof window === 'undefined') return DEFAULT_INSTALLED_APPS;
  try {
    const raw = localStorage.getItem(INSTALLED_APPS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(INSTALLED_APPS_STORAGE_KEY, JSON.stringify(DEFAULT_INSTALLED_APPS));
      return DEFAULT_INSTALLED_APPS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Merge with default to guarantee core fields
      const merged = DEFAULT_INSTALLED_APPS.map((def) => {
        const found = parsed.find((p: any) => p.id === def.id);
        if (found) {
          const isEnabled = found.enabled !== undefined ? found.enabled : found.status !== 'Disabled';
          return {
            ...def,
            ...found,
            enabled: isEnabled,
            status: isEnabled ? (found.status === 'Disabled' ? 'Connected' : found.status || 'Connected') : 'Disabled'
          };
        }
        return def;
      });

      // Also append any newly installed store apps not in defaults
      parsed.forEach((customApp: any) => {
        if (!merged.some((m) => m.id === customApp.id)) {
          merged.push(customApp);
        }
      });

      return merged;
    }
    return DEFAULT_INSTALLED_APPS;
  } catch (e) {
    console.error('Failed to parse installed apps from localStorage:', e);
    return DEFAULT_INSTALLED_APPS;
  }
}

export function saveInstalledApps(apps: InstalledApp[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(INSTALLED_APPS_STORAGE_KEY, JSON.stringify(apps));
    window.dispatchEvent(new CustomEvent(INSTALLED_APPS_UPDATED_EVENT, { detail: apps }));
    window.dispatchEvent(new CustomEvent('payment_gateways_updated'));
  } catch (e) {
    console.error('Failed to save installed apps to localStorage:', e);
  }
}

export function isAppActive(appId: string, currentApps?: InstalledApp[]): boolean {
  const apps = currentApps || getInstalledApps();
  const app = apps.find((a) => a.id === appId);
  if (!app) return true; // If not in list, default to allowed or fallback
  if (app.enabled === false || app.status === 'Disabled') return false;
  return true;
}

export function toggleAppStatus(appId: string, forceEnabled?: boolean): { apps: InstalledApp[]; updatedApp: InstalledApp | null } {
  const apps = getInstalledApps();
  let updatedApp: InstalledApp | null = null;

  const nextApps = apps.map((app) => {
    if (app.id === appId) {
      const willEnable = forceEnabled !== undefined ? forceEnabled : (app.status === 'Disabled' || app.enabled === false);
      const updated: InstalledApp = {
        ...app,
        enabled: willEnable,
        status: willEnable ? 'Connected' : 'Disabled'
      };
      updatedApp = updated;
      return updated;
    }
    return app;
  });

  saveInstalledApps(nextApps);
  return { apps: nextApps, updatedApp };
}

export function isBkashEnabled(currentApps?: InstalledApp[]): boolean {
  return isAppActive('app-bkash', currentApps);
}

export function isNagadEnabled(currentApps?: InstalledApp[]): boolean {
  return isAppActive('app-nagad', currentApps);
}

export function isPathaoEnabled(currentApps?: InstalledApp[]): boolean {
  return isAppActive('app-pathao', currentApps);
}

export function isSteadfastEnabled(currentApps?: InstalledApp[]): boolean {
  return isAppActive('app-steadfast', currentApps);
}

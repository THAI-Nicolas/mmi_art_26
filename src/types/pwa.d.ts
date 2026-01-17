// Type definitions pour le Web App Manifest
export interface WebAppManifest {
  name: string;
  short_name: string;
  description: string;
  start_url: string;
  display: "standalone" | "fullscreen" | "minimal-ui" | "browser";
  background_color: string;
  theme_color: string;
  orientation?: "portrait" | "landscape" | "any";
  icons: ManifestIcon[];
  categories?: string[];
  screenshots?: ManifestScreenshot[];
  shortcuts?: ManifestShortcut[];
}

export interface ManifestIcon {
  src: string;
  sizes: string;
  type: string;
  purpose?: "any" | "maskable" | "monochrome";
}

export interface ManifestScreenshot {
  src: string;
  sizes: string;
  type: string;
  form_factor?: "narrow" | "wide";
  label?: string;
}

export interface ManifestShortcut {
  name: string;
  short_name?: string;
  description?: string;
  url: string;
  icons?: ManifestIcon[];
}

// Type pour le Service Worker
export interface ServiceWorkerRegistration {
  installing: ServiceWorker | null;
  waiting: ServiceWorker | null;
  active: ServiceWorker | null;
  scope: string;
  updateViaCache: "imports" | "all" | "none";
}

// Augmentation des types globaux
declare global {
  interface Window {
    // Event beforeinstallprompt pour PWA
    addEventListener(
      type: "beforeinstallprompt",
      listener: (event: BeforeInstallPromptEvent) => void
    ): void;
    addEventListener(
      type: "appinstalled",
      listener: (event: Event) => void
    ): void;
  }

  interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{
      outcome: "accepted" | "dismissed";
      platform: string;
    }>;
  }
}

export {};

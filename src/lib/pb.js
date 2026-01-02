import PocketBase from "pocketbase";

export const pb = new PocketBase(
  import.meta.env.POCKETBASE_URL || "http://127.0.0.1:8090"
);

// Désactiver l'auto-cancellation pour le rendu SSR Astro
pb.autoCancellation(false);

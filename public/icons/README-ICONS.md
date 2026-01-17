# Guide de génération des icônes PWA

Pour générer les icônes de votre PWA, vous pouvez utiliser un service en ligne ou un outil local.

## Option 1 : Utiliser RealFaviconGenerator (Recommandé)

1. Visitez https://realfavicongenerator.net/
2. Uploadez votre logo (minimum 512x512px, format PNG avec fond transparent)
3. Configurez les options pour Android et iOS
4. Téléchargez le package et extrayez les fichiers dans `/public/icons/`

## Option 2 : Utiliser PWA Asset Generator

```bash
npx @vite-pwa/assets-generator --preset minimal public/logo.png public/icons
```

## Option 3 : Génération manuelle avec ImageMagick ou Sharp

Si vous avez un logo source (logo.png) à 1024x1024px :

```bash
# Installer ImageMagick
# Windows : https://imagemagick.org/script/download.php

# Puis générer les tailles
magick logo.png -resize 72x72 public/icons/icon-72x72.png
magick logo.png -resize 96x96 public/icons/icon-96x96.png
magick logo.png -resize 128x128 public/icons/icon-128x128.png
magick logo.png -resize 144x144 public/icons/icon-144x144.png
magick logo.png -resize 152x152 public/icons/icon-152x152.png
magick logo.png -resize 192x192 public/icons/icon-192x192.png
magick logo.png -resize 384x384 public/icons/icon-384x384.png
magick logo.png -resize 512x512 public/icons/icon-512x512.png
```

## Pour les icônes maskable (Android)

Les icônes maskable doivent avoir une zone de sécurité (safe zone) de 40% autour du contenu principal.
Vous pouvez utiliser https://maskable.app/ pour tester vos icônes.

## Icônes pour les raccourcis

Créez également 3 icônes pour les shortcuts (96x96) :

- shortcut-expo.png
- shortcut-artists.png
- shortcut-vr.png

## Screenshots (optionnel mais recommandé pour le store)

- Mobile : 390x844px (portrait)
- Desktop : 1920x1080px (landscape)

Placez les screenshots dans `/public/screenshots/`

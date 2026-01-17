# Guide de déploiement et test de la PWA

## 📋 Checklist avant déploiement

### 1. Générer les icônes

- [ ] Créer un logo source de 1024x1024px
- [ ] Générer toutes les tailles d'icônes (voir `/public/icons/README-ICONS.md`)
- [ ] Créer les icônes maskable pour Android
- [ ] Créer les icônes pour les shortcuts
- [ ] (Optionnel) Créer des screenshots mobile et desktop

### 2. Configuration

- [ ] Vérifier que le `site` dans `astro.config.mjs` correspond à votre URL de production
- [ ] Mettre à jour les couleurs dans `manifest.webmanifest` si nécessaire
- [ ] Vérifier que tous les chemins dans le Service Worker sont corrects

### 3. Build et test local

```bash
npm run build
npm run preview
```

Puis tester sur : http://localhost:4321

### 4. Tester le Service Worker

1. Ouvrir les DevTools (F12)
2. Aller dans l'onglet "Application" (Chrome) ou "Stockage" (Firefox)
3. Section "Service Workers" : vérifier que le SW est enregistré
4. Section "Manifest" : vérifier que toutes les infos sont correctes
5. Tester le mode hors ligne :
   - Cocher "Offline" dans l'onglet Service Workers
   - Naviguer sur le site

### 5. Tester sur mobile

#### Android (Chrome)

1. Déployer sur Netlify ou votre serveur (HTTPS obligatoire)
2. Ouvrir le site dans Chrome
3. Une bannière "Ajouter à l'écran d'accueil" devrait apparaître
4. Ou via le menu ⋮ > "Installer l'application"
5. L'icône apparaîtra sur l'écran d'accueil

#### iOS (Safari)

1. Ouvrir le site dans Safari
2. Appuyer sur le bouton Partager 📤
3. Sélectionner "Sur l'écran d'accueil"
4. Personnaliser le nom si nécessaire
5. Appuyer sur "Ajouter"

### 6. Tests de performance

#### Lighthouse

```bash
# Installer Lighthouse CLI
npm install -g lighthouse

# Lancer l'audit
lighthouse https://votre-site.com --view
```

Critères PWA à vérifier :

- [ ] Score PWA > 90
- [ ] Service Worker enregistré
- [ ] Manifest valide
- [ ] HTTPS activé
- [ ] Mode hors ligne fonctionnel
- [ ] Page de chargement rapide (< 3s)
- [ ] Responsive design

#### WebPageTest

- Tester sur : https://www.webpagetest.org/
- Vérifier le First Contentful Paint (FCP)
- Vérifier le Time to Interactive (TTI)

## 🔧 Commandes utiles

### Vider le cache du Service Worker (en développement)

Dans la console du navigateur :

```javascript
navigator.serviceWorker.getRegistrations().then(function (registrations) {
  for (let registration of registrations) {
    registration.unregister();
  }
});
caches.keys().then(function (names) {
  for (let name of names) caches.delete(name);
});
```

### Forcer la mise à jour du Service Worker

```javascript
navigator.serviceWorker.getRegistration().then((reg) => {
  reg.update();
});
```

## 🐛 Debugging

### Le Service Worker ne s'enregistre pas

1. Vérifier que vous êtes en HTTPS (ou localhost)
2. Vérifier qu'il n'y a pas d'erreurs JS dans la console
3. Vérifier le chemin du fichier `sw.js`

### L'icône ne s'affiche pas correctement

1. Vérifier le format PNG (pas de SVG pour les icônes PWA)
2. Vérifier les dimensions exactes
3. Pour iOS : l'icône ne doit pas avoir de transparence sur les bords

### Le site ne fonctionne pas hors ligne

1. Vérifier que les ressources sont bien mises en cache
2. Vérifier la stratégie de cache dans `sw.js`
3. Regarder l'onglet "Cache Storage" dans les DevTools

### La bannière d'installation n'apparaît pas

1. Vérifier les critères PWA dans Lighthouse
2. Sur Android : désinstaller l'app si déjà installée
3. Vérifier que le manifest est valide
4. Attendre quelques secondes (le prompt est retardé de 3s)

## 📊 Métriques à surveiller

### Performance

- First Contentful Paint (FCP) : < 1.8s
- Time to Interactive (TTI) : < 3.8s
- Total Blocking Time (TBT) : < 200ms
- Cumulative Layout Shift (CLS) : < 0.1

### PWA

- Service Worker : ✅ Installé
- Manifest : ✅ Valide
- Offline : ✅ Fonctionnel
- Installable : ✅ Oui

## 🚀 Déploiement sur Netlify

Votre configuration netlify.toml devrait déjà gérer le build. Vérifiez juste que :

```toml
[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

[[headers]]
  for = "/manifest.webmanifest"
  [headers.values]
    Content-Type = "application/manifest+json"
    Cache-Control = "public, max-age=604800"
```

## 📱 Limitations iOS

À noter concernant iOS :

- ✅ Installation possible via "Ajouter à l'écran d'accueil"
- ✅ Mode standalone fonctionnel
- ✅ Cache offline fonctionnel
- ❌ Pas de Web Push Notifications natives
- ❌ Bannière d'installation automatique non supportée
- ❌ Stockage limité (50MB max)
- ❌ Shortcuts non supportés
- ⚠️ Le Service Worker peut être supprimé après quelques semaines d'inactivité

## 🔐 Sécurité

- Le Service Worker nécessite HTTPS
- Vérifier les CORS pour les ressources externes
- Ne jamais cacher des données sensibles
- Implémenter une politique de cache appropriée

## 📈 Suivi

Vous pouvez suivre les installations PWA dans Google Analytics :

```javascript
window.addEventListener("appinstalled", () => {
  // Tracker l'installation
  gtag("event", "pwa_install", {
    event_category: "PWA",
    event_label: "App Installed",
  });
});
```

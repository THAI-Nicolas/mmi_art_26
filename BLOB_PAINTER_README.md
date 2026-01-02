# 🎨 Liquid Blobs - Système d'Animation Organique

Système de formes organiques animées avec effet "gooey" pour MMI Art 26.

## ✨ Fonctionnalités

- **Effet Gooey** : Filtres SVG pour un rendu liquide et organique
- **Animation GSAP** : Animations fluides et performantes
- **Interaction Souris** : Suivi du curseur avec effet visqueux
- **Masquage d'Images** : Utilisation comme clip-path pour avatars et œuvres
- **Transitions de Page** : Effet liquide pour les changements de pages
- **Performance Optimisée** : Utilisation de `will-change` et ticker GSAP

## 📦 Installation

Les dépendances nécessaires :

```bash
npm install gsap
```

## 🚀 Utilisation

### Blob Simple

```astro
---
import BlobPainter from '../components/BlobPainter.astro';
---

<BlobPainter
  color="#FF6B6B"
  width={300}
  height={300}
  blobCount={5}
/>
```

### Blob avec Image (Avatar d'Artiste)

```astro
<BlobPainter
  imageUrl="/images/artiste.jpg"
  color="#4ECDC4"
  width={300}
  height={300}
  blobCount={6}
  intensity={22}
/>
```

### Utilisation avec PocketBase

```astro
---
import BlobPainter from '../components/BlobPainter.astro';
import pb from '../lib/pb';

const artiste = await pb.collection('artistes').getOne('RECORD_ID');
const imageUrl = pb.files.getUrl(artiste, artiste.photo, { thumb: '400x400' });
---

<BlobPainter
  imageUrl={imageUrl}
  color="#9D4EDD"
  width={280}
  height={280}
/>
```

## 🎛️ Props

| Prop        | Type     | Défaut      | Description                |
| ----------- | -------- | ----------- | -------------------------- |
| `imageUrl`  | `string` | `undefined` | URL de l'image à masquer   |
| `color`     | `string` | `"#FF6B6B"` | Couleur du blob            |
| `width`     | `number` | `400`       | Largeur en pixels          |
| `height`    | `number` | `400`       | Hauteur en pixels          |
| `blobCount` | `number` | `5`         | Nombre de cercles animés   |
| `intensity` | `number` | `20`        | Intensité du flou gaussien |
| `className` | `string` | `""`        | Classes CSS additionnelles |

## 🌊 Transition Liquide

Pour ajouter des transitions de page liquides :

```astro
---
import LiquidTransition from '../components/LiquidTransition.astro';
---

<Layout>
  <!-- Votre contenu -->
  <LiquidTransition color="#FF6B6B" />
</Layout>
```

Déclencher la transition en JavaScript :

```javascript
import { animateLiquidTransition } from "../components/LiquidTransition.astro";

// Au clic sur un lien
animateLiquidTransition(() => {
  window.location.href = "/nouvelle-page";
});
```

## 🎨 Palette de Couleurs MMI Art 26

```javascript
const blobColors = [
  "#FF6B6B", // Rouge corail
  "#4ECDC4", // Turquoise
  "#9D4EDD", // Violet
  "#F72585", // Rose fuchsia
  "#06FFA5", // Vert néon
  "#FFD93D", // Jaune
  "#6BCF7F", // Vert menthe
  "#FF9F45", // Orange
];
```

## 🔧 Personnalisation Avancée

### Ajuster la Viscosité

Plus la valeur est basse, plus le suivi est rapide :

```javascript
// Dans le script du composant, ligne ~130
const newCx = currentCx + (mouseX - currentCx) * 0.15; // 0.15 = viscosité
```

### Modifier l'Effet Gooey

Ajustez les valeurs du filtre SVG :

```html
<feGaussianBlur stdDeviation="20" />
<!-- Flou -->
<feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" />
<!-- 18 = contraste, -7 = seuil -->
```

## 📱 Responsive

Les composants s'adaptent automatiquement. Exemple pour mobile :

```astro
<BlobPainter
  width={250}
  height={250}
  blobCount={4}
  className="hidden md:block"
/>
```

## 🎯 Cas d'Usage

1. **Avatars d'Artistes** : Galerie avec masque liquide
2. **Cartes de Présentation** : Effet hover sur les œuvres
3. **Hero Section** : Blob animé en arrière-plan
4. **Transitions** : Navigation entre pages
5. **Loader** : Animation de chargement organique

## ⚡ Performance

- **will-change** : Optimisation GPU
- **GSAP Ticker** : 60fps constant
- **SVG** : Léger et scalable
- **Lazy Loading** : Initialisation au chargement de page

## 🐛 Troubleshooting

### Le blob ne s'anime pas

Vérifiez que GSAP est bien installé et que le script s'exécute :

```bash
npm install gsap
```

### L'image ne s'affiche pas

Assurez-vous que l'URL de l'image est correcte et accessible.

### Performances lentes

Réduisez le `blobCount` et l'`intensity` :

```astro
<BlobPainter blobCount={3} intensity={15} />
```

## 📄 Pages de Démo

- `/blob-demo` : Démonstration complète avec exemples
- `/artistes` : Intégration PocketBase avec galerie

## 🎓 Approche Technique

### Pourquoi des cercles plutôt que des paths ?

**Cercles animés (approche choisie) :**

- ✅ Performance : Simples à animer avec `attr`
- ✅ Fluidité : GSAP optimise les transformations
- ✅ Effet gooey : Fusion naturelle avec filtres
- ✅ Contrôle : Facile de gérer chaque blob

**Paths morphing (alternative) :**

- ❌ Complexe : Nécessite MorphSVG (payant)
- ❌ Performance : Calculs lourds
- ❌ Points : Difficile de maintenir le même nombre

### Le Filtre Gooey Expliqué

```html
<feGaussianBlur stdDeviation="20" />
<!-- Floute les cercles pour créer des zones de fusion -->

<feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" />
<!-- Augmente le contraste (18) et définit un seuil (-7) -->
<!-- Résultat : les zones floues fusionnent visuellement -->
```

## 🚀 Évolutions Possibles

- [ ] Variantes de formes (triangles, carrés)
- [ ] Mode "explosion" au clic
- [ ] Traînée de peinture au drag
- [ ] Synchronisation audio (réaction à la musique)
- [ ] Thèmes de couleurs dynamiques

## 📝 Licence

Projet MMI Art 26 - Usage éducatif

---

**Créé avec ❤️ et GSAP**

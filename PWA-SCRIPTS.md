# Scripts utiles pour la gestion de la PWA

## Script de génération d'icônes (Node.js)

Installez sharp si vous voulez générer les icônes automatiquement :

```bash
npm install --save-dev sharp
```

Puis créez ce script `scripts/generate-icons.js` :

```javascript
import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputFile = "public/logo-source.png"; // Votre logo source (1024x1024)
const outputDir = "public/icons";

async function generateIcons() {
  try {
    // Créer le dossier icons s'il n'existe pas
    await fs.mkdir(outputDir, { recursive: true });

    console.log("🎨 Génération des icônes PWA...\n");

    // Générer les icônes standards
    for (const size of sizes) {
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
      await sharp(inputFile)
        .resize(size, size, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toFile(outputPath);

      console.log(`✅ Généré: icon-${size}x${size}.png`);
    }

    // Générer les icônes maskable (avec padding pour la safe zone)
    console.log("\n🎭 Génération des icônes maskable...\n");

    for (const size of [192, 512]) {
      const outputPath = path.join(
        outputDir,
        `icon-maskable-${size}x${size}.png`
      );
      const paddedSize = Math.floor(size * 0.6); // 40% de padding

      await sharp(inputFile)
        .resize(paddedSize, paddedSize, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .extend({
          top: Math.floor((size - paddedSize) / 2),
          bottom: Math.ceil((size - paddedSize) / 2),
          left: Math.floor((size - paddedSize) / 2),
          right: Math.ceil((size - paddedSize) / 2),
          background: "#000000",
        })
        .png()
        .toFile(outputPath);

      console.log(`✅ Généré: icon-maskable-${size}x${size}.png`);
    }

    console.log("\n✨ Génération terminée avec succès!\n");
    console.log(
      "💡 N'oubliez pas de tester vos icônes maskable sur: https://maskable.app/\n"
    );
  } catch (error) {
    console.error("❌ Erreur lors de la génération:", error);
    process.exit(1);
  }
}

generateIcons();
```

Ajoutez dans package.json :

```json
{
  "scripts": {
    "generate-icons": "node scripts/generate-icons.js"
  }
}
```

## Script de vérification PWA

Créez `scripts/verify-pwa.js` :

```javascript
import { promises as fs } from "fs";
import path from "path";

const requiredFiles = [
  "public/manifest.webmanifest",
  "public/sw.js",
  "public/icons/icon-192x192.png",
  "public/icons/icon-512x512.png",
];

async function verifyPWA() {
  console.log("🔍 Vérification de la configuration PWA...\n");

  let allGood = true;

  for (const file of requiredFiles) {
    try {
      await fs.access(file);
      console.log(`✅ ${file}`);
    } catch {
      console.log(`❌ Manquant: ${file}`);
      allGood = false;
    }
  }

  // Vérifier le manifest
  try {
    const manifestContent = await fs.readFile(
      "public/manifest.webmanifest",
      "utf-8"
    );
    const manifest = JSON.parse(manifestContent);

    console.log("\n📄 Manifest:");
    console.log(`  - Name: ${manifest.name}`);
    console.log(`  - Short name: ${manifest.short_name}`);
    console.log(`  - Icons: ${manifest.icons?.length || 0}`);
    console.log(`  - Start URL: ${manifest.start_url}`);
    console.log(`  - Display: ${manifest.display}`);
  } catch (error) {
    console.log("\n❌ Erreur lors de la lecture du manifest");
    allGood = false;
  }

  console.log(
    "\n" +
      (allGood ? "✨ Configuration PWA OK!" : "⚠️  Configuration incomplète")
  );

  if (!allGood) {
    process.exit(1);
  }
}

verifyPWA();
```

Ajoutez dans package.json :

```json
{
  "scripts": {
    "verify-pwa": "node scripts/verify-pwa.js"
  }
}
```

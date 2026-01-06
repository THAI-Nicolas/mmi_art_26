import { pb } from "./pb.js";

//Fonction pour récupérer tous les artistes
export async function getAllArtistes() {
  try {
    const record = await pb
      .collection("artistes")
      .getFullList({ expand: "canaux_id" });
    return record;
  } catch (error) {
    console.error("Erreur lors de la récupération des artistes");
    return [];
  }
}

//Fonction pour récupérer un artiste en fonction de son ID

export async function GetArtistById(id) {
  try {
    const record = await pb
      .collection("artistes")
      .getOne(id, { expand: "oeuvres_id.oeuvres_images,canaux_id" });

    return record;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'artiste",
      error.status,
      error.message
    );
    return null;
  }
}

//Fonction pour récupérer toutes les oeuvres

export async function getAllOeuvres() {
  try {
    const record = await pb
      .collection("oeuvres")
      .getFullList({ expand: "artiste_id, oeuvres_images" });
    return record;
  } catch (error) {
    console.error("Erreur lors de la récupération des oeuvres");
    return [];
  }
}

//Fonction pour récupérer une oeuvre en fonction de son ID
export async function getOneOeuvre(id) {
  try {
    const record = await pb
      .collection("oeuvres")
      .getOne(id, { expand: "artiste_id,oeuvres_images" });
    return record;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'oeuvre");
    return null;
  }
}

//Fonction pour récupérer toutes les oeuvres d'un artiste
export async function getOeuvresByArtistId(artistId, excludeOeuvreId = null) {
  try {
    const filter = excludeOeuvreId
      ? `artiste_id = "${artistId}" && id != "${excludeOeuvreId}"`
      : `artiste_id = "${artistId}"`;

    const records = await pb.collection("oeuvres").getFullList({
      filter: filter,
      expand: "oeuvres_images",
      sort: "-created",
    });
    return records;
  } catch (error) {
    console.error("Erreur lors de la récupération des œuvres de l'artiste");
    return [];
  }
}

//Fonction Utilitaire pour récupérer les images depuis PocketBase (et non les liens)
export function getImageUrl(record, filename) {
  if (!record || !filename) {
    return "/image-secours.webp";
  }
  return `${import.meta.env.POCKETBASE_URL}/api/files/${record.collectionId}/${
    record.id
  }/${filename}`;
}

//Fonction de filtrage pour les artistes
export async function getFilteredArtists(mmi_year, recherche) {
  try {
    let filtres = [];

    //Fonction selection mmi_year
    if (mmi_year && mmi_year !== "TOUT") {
      filtres.push(`mmi_year = "${mmi_year}"`);
    }

    //Fonction recherche
    if (recherche) {
      filtres.push(`nom ~ "${recherche}"`);
    }

    const filterString = filtres.join(" && ");
    const resultat = await pb
      .collection("artistes")
      .getFullList({ filter: filterString, expand: "canaux_id" });

    return resultat;
  } catch (error) {
    console.error("Erreur lors du filtrage des artistes");
    return [];
  }
}

//Fonction de filtrage pour les oeuvres
export async function getFilteredOeuvres(years, category, recherche) {
  try {
    let filtres = [];

    if (years && years.length > 0) {
      const yearsFilter = years
        .map((annee) => `artiste_id.mmi_year = "${annee}"`)
        .join(" || ");
      filtres.push(`(${yearsFilter})`);
    }

    if (category && category !== "TOUT") {
      filtres.push(`category = "${category}"`);
    }

    if (recherche) {
      filtres.push(`title ~ "${recherche}"`);
    }
    let filterString = filtres.join(" && ");
    const resultat = await pb.collection("oeuvres").getFullList({
      filter: filterString,
      expand: "artiste_id, oeuvres_images",
    });
    return resultat;
  } catch (error) {
    console.error("Erreur lors du filtrage des oeuvres");
    return [];
  }
}

//Fonction pour récupérer des suggestions d'artistes de la même promotion
export async function getSuggestedArtistes(currentArtiste, limit = 3) {
  try {
    const mmiYear = currentArtiste?.mmi_year;
    const currentId = currentArtiste?.id;

    if (!mmiYear || !currentId) return [];

    const filter = `mmi_year = "${mmiYear}" && id != "${currentId}"`;

    const artistes = await pb.collection("artistes").getFullList({
      filter: filter,
      expand: "canaux_id",
      sort: "name", // Tri alphabétique déterministe pour le SEO
    });

    return artistes.slice(0, limit);
  } catch (error) {
    console.error("Erreur lors de la récupération des suggestions d'artistes");
    return [];
  }
}

//Fonction pour récupérer des suggestions d'œuvres avec stratégie Waterfall SEO
// Priorité : Catégorie → Promotion MMI → Plus récentes
export async function getSuggestedOeuvres(
  currentOeuvre,
  excludeIds = [],
  limit = 3
) {
  try {
    const suggestions = [];
    const category = currentOeuvre?.category;
    const mmiYear = currentOeuvre?.expand?.artiste_id?.mmi_year;
    const currentId = currentOeuvre?.id || "";

    // Tri déterministe basé sur l'ID pour varier les suggestions par œuvre
    const deterministicSort = (items) => {
      const hash = currentId
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return items.sort((a, b) => {
        const hashA = (a.id.charCodeAt(0) + hash) % items.length;
        const hashB = (b.id.charCodeAt(0) + hash) % items.length;
        return hashA - hashB;
      });
    };

    const buildExcludeFilter = (ids) =>
      ids.length > 0 ? ids.map((id) => `id != "${id}"`).join(" && ") : "";

    // PRIORITÉ 1 : Même catégorie (avec diversification d'artistes)
    if (category && suggestions.length < limit) {
      const filter = [
        `category = "${category}"`,
        buildExcludeFilter(excludeIds),
      ]
        .filter(Boolean)
        .join(" && ");

      const oeuvres = await pb.collection("oeuvres").getFullList({
        filter,
        expand: "artiste_id, oeuvres_images",
      });

      const sorted = deterministicSort([...oeuvres]);

      // Prioriser 1 œuvre par artiste différent
      const uniqueArtists = [];
      const seenArtists = new Set();

      for (const oeuvre of sorted) {
        const artistId = oeuvre.expand?.artiste_id?.id;
        if (artistId && !seenArtists.has(artistId)) {
          uniqueArtists.push(oeuvre);
          seenArtists.add(artistId);
          if (uniqueArtists.length >= limit) break;
        }
      }

      // Utiliser artistes uniques si suffisant, sinon compléter
      if (uniqueArtists.length >= limit) {
        suggestions.push(...uniqueArtists.slice(0, limit));
      } else {
        suggestions.push(...uniqueArtists);
        const remaining = sorted.filter((o) => !uniqueArtists.includes(o));
        suggestions.push(...remaining.slice(0, limit - suggestions.length));
      }
    }

    // PRIORITÉ 2 : Même promotion MMI
    if (mmiYear && suggestions.length < limit) {
      const allExcludeIds = [...excludeIds, ...suggestions.map((o) => o.id)];
      const filter = [
        `artiste_id.mmi_year = "${mmiYear}"`,
        buildExcludeFilter(allExcludeIds),
      ]
        .filter(Boolean)
        .join(" && ");

      const oeuvres = await pb.collection("oeuvres").getFullList({
        filter,
        expand: "artiste_id, oeuvres_images",
        sort: "-created",
      });

      suggestions.push(...oeuvres.slice(0, limit - suggestions.length));
    }

    // PRIORITÉ 3 : Plus récentes
    if (suggestions.length < limit) {
      const allExcludeIds = [...excludeIds, ...suggestions.map((o) => o.id)];
      const filter = buildExcludeFilter(allExcludeIds);

      const oeuvres = await pb.collection("oeuvres").getFullList({
        filter: filter || undefined,
        expand: "artiste_id, oeuvres_images",
        sort: "-created",
      });

      suggestions.push(...oeuvres.slice(0, limit - suggestions.length));
    }

    return suggestions.slice(0, limit);
  } catch (error) {
    console.error("Erreur lors de la récupération des suggestions d'œuvres");
    return [];
  }
}

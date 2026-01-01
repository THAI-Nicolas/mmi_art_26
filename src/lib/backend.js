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
    return [];
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
      .getOne(id, { expand: "artiste_id, oeuvres_images" });
    return record;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'oeuvre");
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

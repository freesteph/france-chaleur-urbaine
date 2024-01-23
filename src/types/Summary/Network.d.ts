export interface Network {
  id_fcu: string;
  'Taux EnR&R': number;
  Gestionnaire: string;
  'Identifiant reseau': string;
  'contenu CO2 ACV': number;
  nom_reseau: string;
  'Rend%': number;
  PM: number;
  PM_L: number;
  PM_T: number;
  'PV%': number;
  'PF%': number;
  livraisons_totale_MWh: number;
  livraisons_residentiel_MWh: number;
  livraisons_tertiaire_MWh: number;
  longueur_reseau: number;
  nb_pdl: number;
  annee_creation: number;
  '%_fluide_caloporteur_eau_chaude'?: number;
  '%_fluide_caloporteur_eau_surchauffee'?: number;
  '%_fluide_caloporteur_vapeur'?: number;
  MO: string;
  adresse_mo: string;
  CP_MO: string;
  ville_mo: string;
  adresse_gestionnaire: string;
  CP_gestionnaire: string;
  ville_gestionnaire: string;
  prod_MWh_gaz_naturel: number;
  prod_MWh_charbon: number;
  prod_MWh_fioul_domestique: number;
  prod_MWh_fioul_lourd: number;
  prod_MWh_GPL: number;
  prod_MWh_biomasse_solide: number;
  prod_MWh_dechets_internes: number;
  prod_MWh_UIOM: number;
  prod_MWh_biogaz: number;
  prod_MWh_geothermie: number;
  prod_MWh_PAC_ENR: number;
  prod_MWh_PAC_nonENR: number;
  prod_MWh_solaire_thermique: number;
  prod_MWh_chaleur_industiel: number;
  prod_MWh_autre_chaleur_recuperee_ENR: number;
  prod_MWh_autre_chaleur_recuperee_nonENR: number;
  prod_MWh_chaudieres_electriques: number;
  prod_MWh_autre_RCU_ENR: number;
  prod_MWh_autre_RCU_nonENR: number;
  prod_MWh_autres_ENR: number;
  prod_MWh_autres_nonENR: number;
  lon: number;
  lat: number;
  website_gestionnaire: string;
  'reseaux classes': boolean;
  informationsComplementaires: string;
  fichiers: NetworkAttachment[];
}

export interface NetworkAttachment {
  id: string;
  filename: string;
  size: number;
  type: string;
  url: string;
}

export interface NetworkSummary {
  length: number;
  'Taux EnR&R': number;
  Gestionnaire: string;
  commentaires: string;
  'Identifiant reseau': string;
  'reseaux classes': boolean;
  'contenu CO2 ACV': number;
  nom_reseau: string;
  livraisons_totale_MWh: number;
  nb_pdl: number;
  isCold?: boolean;
}

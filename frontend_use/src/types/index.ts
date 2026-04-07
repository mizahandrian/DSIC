// src/types/index.ts
export interface Direction {
  id_direction: number;
  nom_direction: string;
}

export interface Service {
  id_service: number;
  nom_service: string;
  id_direction: number;
}

export interface Poste {
  id_poste: number;
  titre_poste: string;
  indice: string;
  id_carriere: number;
}

export interface Carriere {
  id_carriere: number;
  categorie: string;
  indice: string;
  corps: string;
  date_effet: string;
}

export interface StatutAdmin {
  id_statut: number;
  nom_statut: string;
  type_statut: string;
}

export interface Etat {
  id_etat: number;
  nom_etat: string;
  cause_inactivite?: string;
}

export interface Personnel {
  id_personnel: number;
  nom: string;
  prenom: string;
  tel: string;
  genre: 'M' | 'F';
  numero_cin: string;
  date_naissance: string;
  date_entree: string;
  motif_entree: string;
  ancien_travail: string;
  id_direction: number;
  id_service: number;
  id_poste: number;
  id_etat: number;
  direction_nom?: string;
  service_nom?: string;
  poste_titre?: string;
  etat_nom?: string;
}
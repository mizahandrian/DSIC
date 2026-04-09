// src/types/index.ts
export interface Direction {
  id_direction: number;
  nom_direction: string;
  type?: string;
  nombre_services?: number;
  nombre_personnels?: number;
}

export interface Service {
  id_service: number;
  nom_service: string;
  id_direction: number;
  direction_nom?: string;
  nombre_postes?: number;
  nombre_personnels?: number;
}

export interface Poste {
  id_poste: number;
  titre_poste: string;
  indice: string;
  id_service: number;
  id_carriere: number;
  service_nom?: string;
  carriere_categorie?: string;
  nombre_personnels?: number;
}

export interface Carriere {
  id_carriere: number;
  categorie: string;
  indice: string;
  corps: string;
  date_effet: string;
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
  id_direction: number;
  id_service: number;
  id_poste: number;
  id_etat: number;
  direction_nom?: string;
  service_nom?: string;
  poste_titre?: string;
  etat_nom?: string;
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

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// BaseRohi

export interface BaseRohi {
  id_rohi: number;
  immatricule: string;
  nom: string;
  prenom: string;
  poste: string;
  porte: string;
  telephone: string;
  direction: string;
  service: string;
  date_integration?: string;
  statut?: string;
  created_at?: string;
}

export interface PersonnelRohi {
  id_personnel: number;
  id_rohi: number;
  date_liaison: string;
  personnel_nom?: string;
  personnel_prenom?: string;
  rohi_immatricule?: string;
  rohi_nom?: string;
  rohi_prenom?: string;
}
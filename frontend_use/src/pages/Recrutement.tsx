// src/pages/Recrutement.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faIdCard, faPhone, faVenusMars, faCalendarAlt,
  faBuilding, faBriefcase, faUserTie, faChartLine,
  faCheckCircle, faHistory, faArrowLeft, faArrowRight,
  faSave, faUserCheck, faExchangeAlt, faInfoCircle,
  faTag, faLayerGroup, faGraduationCap
} from '@fortawesome/free-solid-svg-icons';
import api from '../Service/api';

interface Direction {
  id_direction: number;
  nom_direction: string;
  type: string;
}

interface Service {
  id_service: number;
  nom_service: string;
  id_direction: number;
}

interface Statut {
  id: number;
  nom_statut: string;
  type_statut: string;
}

const Recrutement: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Données principales
  const [directions, setDirections] = useState<Direction[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [statuts, setStatuts] = useState<Statut[]>([]);

  const [formData, setFormData] = useState({

    
    // Étape 1 - Identité
    nom: '',
    prenom: '',
    genre: 'M',
    numero_cin: '',
    tel: '',
    date_naissance: '',
    
    // Étape 2 - Professionnel
    date_entree: '',
    motif_entree: '',
    id_direction: '',
    id_service: '',
    poste: '', // Champ texte libre pour le poste
    
    // Étape 3 - Carrière
    categorie: '',
    indice: '',
    corps: '',
    grade: '',
    date_effet_carriere: '',
    
    // Étape 4 - Statut
    id_statut: '',
    id_etat: 'actif',
    situation: 'activite',
    date_situation: '',
    destination: '',
    commentaire_situation: '',
    
    // Étape 5 - Historique
    ancien_poste: '',
    ancien_direction: '',
    commentaire_historique: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  //model vaovao
  const fetchServicesByDirection = async (directionId: number) => {
    try {
      const res = await api.get(`/services/direction/${directionId}`);
      setFilteredServices(res.data);

      setFormData(prev => ({
        ...prev,
        id_service: ''
      }));

    } catch (error: any) {
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);
      console.log("HEADERS:", error.response?.headers);

      alert(error.response?.status + " - " + JSON.stringify(error.response?.data));
    }
  };

  useEffect(() => {
    if (formData.id_direction) {
      fetchServicesByDirection(parseInt(formData.id_direction));
    } else {
      setFilteredServices([]);
    }
  }, [formData.id_direction]);

  const fetchData = async () => {
    try {
      const [dirRes, servicesRes, statutsRes] = await Promise.all([
        api.get('/directions'),
        api.get('/services/direction/1'),
        api.get('/statuts')
      ]);
      setDirections(dirRes.data);
      setServices(servicesRes.data);
      setStatuts(statutsRes.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep = (step: number): string | null => {
    switch (step) {
      case 1:
        if (!formData.nom.trim()) return 'Le nom est requis.';
        if (!formData.prenom.trim()) return 'Le prénom est requis.';
        if (!formData.numero_cin.trim()) return 'Le numéro de CIN est requis.';
        if (!formData.date_naissance) return 'La date de naissance est requise.';
        return null;
      case 2:
        if (!formData.date_entree) return 'La date d’entrée est requise.';
        if (!formData.motif_entree.trim()) return 'Le motif d’entrée est requis.';
        if (!formData.id_direction) return 'La direction est requise.';
        if (!formData.id_service) return 'Le service est requis.';
        if (!formData.poste.trim()) return 'Le poste est requis.';
        return null;
      case 3:
        if (!formData.categorie) return 'La catégorie est requise.';
        if (!formData.indice.trim()) return 'L’indice est requis.';
        if (!formData.corps.trim()) return 'Le corps est requis.';
        if (!formData.grade.trim()) return 'Le grade est requis.';
        if (!formData.date_effet_carriere) return 'La date d’effet de carrière est requise.';
        return null;
      case 4:
        if (!formData.id_etat) return 'L’état est requis.';
        return null;
      default:
        return null;
    }
  };

  const validateAllSteps = (): string | null => {
    for (let step = 1; step <= 4; step += 1) {
      const error = validateStep(step);
      if (error) return error;
    }
    return null;
  };

  const formatDate = (date: string): string | null => {
  if (!date || date.trim() === '') return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().split('T')[0]; // → "2026-05-19"
};

 const handleSubmit = async () => {
  const validationError = validateAllSteps();
  if (validationError) {
    alert(validationError);
    return;
  }

  setLoading(true);

  try {
    // ✅ UN SEUL appel API — le controller Laravel gère tout
    const personnelData = {
      nom:            formData.nom.trim(),
      prenom:         formData.prenom.trim(),
      genre:          formData.genre,
      numero_cin:     formData.numero_cin.trim(),
      tel:            formData.tel?.trim() || null,
      date_naissance: formData.date_naissance,

      date_entree:    formData.date_entree,
      motif_entree:   formData.motif_entree?.trim() || null,

      id_direction:   formData.id_direction ? Number(formData.id_direction) : null,
      id_service:     formData.id_service   ? Number(formData.id_service)   : null,
      id_statut:      formData.id_statut    ? Number(formData.id_statut)    : null,
      id_etat:        formData.id_etat === 'actif' ? 1 : 2,

      poste:                   formData.poste?.trim()              || null,
      categorie:               formData.categorie?.trim()          || null,
      indice:                  formData.indice                     || null,
      corps:                   formData.corps?.trim()              || null,
      grade:                   formData.grade?.trim()              || null,
      date_effet_carriere:     formData.date_effet_carriere        || null,

      situation:               formData.situation                  || null,
      date_situation:          formData.date_situation             || null,
      destination:             formData.destination                || null,
      commentaire_situation:   formData.commentaire_situation      || null,

      ancien_poste:            formData.ancien_poste               || null,
      ancien_direction:        formData.ancien_direction           || null,
      commentaire_historique:  formData.commentaire_historique     || null,
    };

    console.log("PAYLOAD SEND:", personnelData);

    const response = await api.post('/recrutement', personnelData);
    console.log("RESPONSE:", response.data);

    alert("Personnel ajouté avec succès !");
    navigate('/gestion-personnels');
    resetForm();

  } catch (error: any) {
    console.error("❌ ERREUR:", error.response?.data || error.message);

    const errors = error?.response?.data?.errors;
    if (errors) {
      const first = Object.values(errors)[0];
      alert(`Erreur: ${Array.isArray(first) ? first[0] : first}`);
    } else {
      alert(error?.response?.data?.message || "Erreur lors de l'enregistrement");
    }
  } finally {
    setLoading(false);
  }
};

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      nom: '', prenom: '', genre: 'M', numero_cin: '', tel: '', date_naissance: '',
      date_entree: '', motif_entree: '', id_direction: '', id_service: '', poste: '',
      categorie: '', indice: '', corps: '', grade: '', date_effet_carriere: '',
      id_statut: '', id_etat: 'actif', situation: 'activite', date_situation: '', destination: '', commentaire_situation: '',
      ancien_poste: '', ancien_direction: '', commentaire_historique: '',
    });
  };

  const nextStep = () => {
    const error = validateStep(currentStep);
    if (error) {
      alert(error);
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const steps = [
    { number: 1, title: 'Identité', icon: faUser },
    { number: 2, title: 'Professionnel', icon: faBriefcase },
    { number: 3, title: 'Carrière', icon: faChartLine },
    { number: 4, title: 'Statut', icon: faUserCheck },
    { number: 5, title: 'Historique', icon: faHistory },
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <div className="form-row">
              <div className="form-group">
                <label><FontAwesomeIcon icon={faUser} /> Nom *</label>
                <input type="text" name="nom" value={formData.nom} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label><FontAwesomeIcon icon={faUser} /> Prénom *</label>
                <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label><FontAwesomeIcon icon={faVenusMars} /> Genre *</label>
                <select name="genre" value={formData.genre} onChange={handleChange}>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
              <div className="form-group">
                <label><FontAwesomeIcon icon={faIdCard} /> CIN *</label>
                <input type="text" name="numero_cin" value={formData.numero_cin} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label><FontAwesomeIcon icon={faPhone} /> Téléphone</label>
                <input type="tel" name="tel" value={formData.tel} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label><FontAwesomeIcon icon={faCalendarAlt} /> Date naissance *</label>
                <input type="date" name="date_naissance" value={formData.date_naissance} onChange={handleChange} required />
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="step-content">
            <div className="form-row">
              <div className="form-group">
                <label><FontAwesomeIcon icon={faCalendarAlt} /> Date entrée *</label>
                <input type="date" name="date_entree" value={formData.date_entree} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Motif entrée</label>
                <input type="text" name="motif_entree" value={formData.motif_entree} onChange={handleChange} placeholder="Recrutement, Mutation..." />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label><FontAwesomeIcon icon={faBuilding} /> Direction *</label>
                <select name="id_direction" value={formData.id_direction} onChange={handleChange} required>
                  <option value="">Sélectionner une direction</option>
                  {directions.map(d => <option key={d.id_direction} value={d.id_direction}>{d.nom_direction}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label><FontAwesomeIcon icon={faBriefcase} /> Service *</label>
                <select name="id_service" value={formData.id_service} onChange={handleChange} required disabled={!formData.id_direction}>
                  <option value="">{formData.id_direction ? "Sélectionner un service" : "Choisissez d'abord une direction"}</option>
                  {filteredServices.map(s => (
                    <option key={s.id_service} value={s.id_service}>
                      {s.nom_service}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label><FontAwesomeIcon icon={faUserTie} /> Poste *</label>
              <input type="text" name="poste" value={formData.poste} onChange={handleChange} placeholder="Ex: Administrateur Réseau, Développeur Full Stack..." required />
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="step-content">
            <div className="info-box">
              <FontAwesomeIcon icon={faInfoCircle} />
              <span>Informations sur la carrière du personnel</span>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label><FontAwesomeIcon icon={faLayerGroup} /> Catégorie *</label>
                <select name="categorie" value={formData.categorie} onChange={handleChange} required>
                  <option value="">Sélectionner</option>
                  <option value="A1">A1 - Cadres Supérieurs</option>
                  <option value="A2">A2 - Cadres Moyens</option>
                  <option value="B1">B1 - Techniciens</option>
                  <option value="C1">C1 - Agents</option>
                </select>
              </div>
              <div className="form-group">
                <label><FontAwesomeIcon icon={faTag} /> Indice *</label>
                <input type="text" name="indice" value={formData.indice} onChange={handleChange} placeholder="Ex: 450, 430, 380..." required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label><FontAwesomeIcon icon={faGraduationCap} /> Corps *</label>
                <input type="text" name="corps" value={formData.corps} onChange={handleChange} placeholder="Ex: Ingénieur des Travaux Statistiques..." required />
              </div>
              <div className="form-group">
                <label><FontAwesomeIcon icon={faGraduationCap} /> Grade *</label>
                <input type="text" name="grade" value={formData.grade} onChange={handleChange} placeholder="Ex: Ingénieur Principal, Technicien..." required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label><FontAwesomeIcon icon={faCalendarAlt} /> Date d'effet *</label>
                <input type="date" name="date_effet_carriere" value={formData.date_effet_carriere} onChange={handleChange} required />
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="step-content">
            <div className="form-row">
              <div className="form-group">
                <label><FontAwesomeIcon icon={faUserCheck} /> Statut administratif</label>
                <select name="id_statut" value={formData.id_statut} onChange={handleChange}>
                  <option value="">Sélectionner</option>
                  {statuts.map(s => <option key={s.id} value={s.id}>{s.nom_statut} ({s.type_statut})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label><FontAwesomeIcon icon={faCheckCircle} /> État *</label>
                <select name="id_etat" value={formData.id_etat} onChange={handleChange} required>
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label><FontAwesomeIcon icon={faExchangeAlt} /> Situation</label>
                <select name="situation" value={formData.situation} onChange={handleChange}>
                  <option value="activite">En activité</option>
                  <option value="mise_disposition">Mise à disposition</option>
                  <option value="detachement">Détachement</option>
                  <option value="disponibilite">Disponibilité</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date effet</label>
                <input type="date" name="date_situation" value={formData.date_situation} onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Destination</label>
                <input type="text" name="destination" value={formData.destination} onChange={handleChange} placeholder="Nouveau ministère/institut" />
              </div>
              <div className="form-group">
                <label>Commentaire</label>
                <input type="text" name="commentaire_situation" value={formData.commentaire_situation} onChange={handleChange} />
              </div>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="step-content">
            <div className="info-box">
              <FontAwesomeIcon icon={faInfoCircle} />
              <span>Historique avant l'arrivée du personnel</span>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Ancien poste</label>
                <input type="text" name="ancien_poste" value={formData.ancien_poste} onChange={handleChange} placeholder="Ex: Développeur, Technicien..." />
              </div>
              <div className="form-group">
                <label>Ancienne direction</label>
                <input type="text" name="ancien_direction" value={formData.ancien_direction} onChange={handleChange} placeholder="Ex: DSIC, DG..." />
              </div>
            </div>
            <div className="form-group full-width">
              <label>Commentaire / Motif du changement</label>
              <input type="text" name="commentaire_historique" value={formData.commentaire_historique} onChange={handleChange} />
            </div>
            <div className="summary-box">
              <h4>Récapitulatif</h4>
              <p><strong>{formData.nom} {formData.prenom}</strong> - {formData.numero_cin}</p>
              <p>Direction: {directions.find(d => d.id_direction.toString() === formData.id_direction)?.nom_direction || '-'}</p>
              <p>Service: {services.find(s => s.id_service.toString() === formData.id_service)?.nom_service || '-'}</p>
              <p>Poste: {formData.poste || '-'}</p>
              <p>Carrière: {formData.categorie} - {formData.corps} ({formData.grade})</p>
            </div>
          </div>
        );
      
      default: return null;
    }
  };

  return (
    <div className="recrutement-container">
      <div className="recrutement-header">
        <h1>Nouveau recrutement</h1>
        <p>Ajoutez un personnel en remplissant les informations ci-dessous</p>
      </div>

      <div className="steps-indicator">
        {steps.map((step) => (
          <div key={step.number} className={`step-item ${currentStep >= step.number ? 'active' : ''}`}>
            <div className="step-circle"><FontAwesomeIcon icon={step.icon} /></div>
            <span className="step-title">{step.title}</span>
            {step.number < steps.length && <div className="step-line"></div>}
          </div>
        ))}
      </div>

      <div className="recrutement-form">
        {renderStep()}
        
        <div className="form-navigation">
          {currentStep > 1 && (
            <button type="button" className="btn-prev" onClick={prevStep}>
              <FontAwesomeIcon icon={faArrowLeft} /> Précédent
            </button>
          )}
          {currentStep < 5 ? (
            <button type="button" className="btn-next" onClick={nextStep}>
              Suivant <FontAwesomeIcon icon={faArrowRight} />
            </button>
          ) : (
            <button type="button" className="btn-submit" onClick={handleSubmit} disabled={loading}>
              <FontAwesomeIcon icon={faSave} /> {loading ? 'Enregistrement...' : 'Enregistrer le personnel'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recrutement;
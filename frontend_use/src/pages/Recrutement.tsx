// src/pages/Recrutement.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faIdCard, faPhone, faVenusMars, faCalendarAlt,
  faBuilding, faBriefcase, faUserTie, faChartLine,
  faCheckCircle, faHistory, faArrowLeft, faArrowRight,
  faSave, faUserCheck, faExchangeAlt, faInfoCircle,
  faTag, faLayerGroup, faGraduationCap, faCheck,
  faUserPlus, faComment
} from '@fortawesome/free-solid-svg-icons';
import api from '../Service/api';
import { triggerNotification } from '../components/NotificationBell';

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

interface Poste {
  id_poste: number;
  titre_poste: string;
  id_service: number;
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Données principales
  const [directions, setDirections] = useState<Direction[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [filteredPostes, setFilteredPostes] = useState<Poste[]>([]);
  const [statuts, setStatuts] = useState<Statut[]>([]);

  const [formData, setFormData] = useState({
    // Étape 1 - Identité
    matricule: '',
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
    id_poste: '',
    
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

  const fetchPostesByService = async (serviceId: number) => {
  try {
    const res = await api.get('/postes');
    const filtered = res.data.filter((p: Poste) => p.id_service === serviceId);
    setFilteredPostes(filtered);
  } catch (error) {
    console.error("Erreur chargement postes:", error);
  }
};

useEffect(() => {
  if (formData.id_service) {
    fetchPostesByService(parseInt(formData.id_service));
  } else {
    setFilteredPostes([]);
  }
}, [formData.id_service]);

  const fetchServicesByDirection = async (directionId: number) => {
    try {
      const res = await api.get(`/services/direction/${directionId}`);
      setFilteredServices(res.data);
      setFormData(prev => ({ ...prev, id_service: '' }));
    } catch (error: any) {
      console.error("Erreur chargement services:", error);
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
        if (!formData.id_direction) return 'La direction est requise.';
        if (!formData.id_service) return 'Le service est requis.';
        if (!formData.id_poste.trim()) return 'Le poste est requis.';
        return null;
      case 3:
        if (!formData.categorie) return 'La catégorie est requise.';
        if (!formData.indice.trim()) return 'L’indice est requis.';
        if (!formData.corps.trim()) return 'Le corps est requis.';
        if (!formData.grade.trim()) return 'Le grade est requis.';
        if (!formData.date_effet_carriere) return 'La date d’effet de carrière est requise.';
        return null;
      case 4:
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

  // Fonction pour naviguer vers une étape spécifique
  const goToStep = (stepNumber: number) => {
    // Vérifier si on peut aller à cette étape
    let canGo = true;
    for (let i = 1; i < stepNumber; i++) {
      const error = validateStep(i);
      if (error) {
        canGo = false;
        break;
      }
    }
    
    if (canGo) {
      setCurrentStep(stepNumber);
    } else {
      alert("Veuillez remplir correctement les étapes précédentes");
    }
  };

  const handleSubmit = async () => {
    const validationError = validateAllSteps();
    if (validationError) {
      alert(validationError);
      return;
    }

    setLoading(true);

    try {
      const personnelData = {
        matricule: formData.matricule.trim() || null,
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        genre: formData.genre,
        numero_cin: formData.numero_cin.trim(),
        tel: formData.tel?.trim() || null,
        date_naissance: formData.date_naissance,
        date_entree: formData.date_entree,
        motif_entree: formData.motif_entree?.trim() || null,
        id_direction: formData.id_direction ? Number(formData.id_direction) : null,
        id_service: formData.id_service ? Number(formData.id_service) : null,
        id_statut: formData.id_statut ? Number(formData.id_statut) : null,
        id_etat: formData.id_etat === 'actif' ? 1 : 2,
        id_poste: formData.id_poste ? Number(formData.id_poste) : null,
        categorie: formData.categorie?.trim() || null,
        indice: formData.indice || null,
        corps: formData.corps?.trim() || null,
        grade: formData.grade?.trim() || null,
        date_effet_carriere: formData.date_effet_carriere || null,
        situation: formData.situation || null,
        date_situation: formData.date_situation || null,
        destination: formData.destination || null,
        commentaire_situation: formData.commentaire_situation || null,
        ancien_poste: formData.ancien_poste || null,
        ancien_direction: formData.ancien_direction || null,
        commentaire_historique: formData.commentaire_historique || null,
      };

      await api.post('/recrutement', personnelData);
      
      // === NOTIFICATION AJOUTÉE ICI ===
      triggerNotification(
        'success',
        '✅ Nouveau personnel ajouté',
        `${formData.prenom} ${formData.nom} a été recruté avec succès`,
        '/gestion-personnels'
      );
      // ===============================
      
      setSuccessMessage("Personnel ajouté avec succès !");
      setTimeout(() => {
        navigate('/gestion-personnels');
        resetForm();
      }, 1500);
    } catch (error: any) {
      console.error("Erreur:", error.response?.data || error.message);
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
      matricule: '', nom: '', prenom: '', genre: 'M', numero_cin: '', tel: '', date_naissance: '',
      date_entree: '', motif_entree: '', id_direction: '', id_service: '', id_poste: '',
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
            <div className="form-grid">
              <div className="form-group">
                <label><FontAwesomeIcon icon={faIdCard} /> Matricule *</label>
                <input type="text" name="matricule" value={formData.matricule} onChange={handleChange} placeholder="Matricule" required />
              </div>
              <div className="form-group">
                <label><FontAwesomeIcon icon={faUser} /> Nom complet *</label>
                <input type="text" name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" required />
              </div>
              <div className="form-group">
                <label><FontAwesomeIcon icon={faUser} /> Prénom *</label>
                <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Prénom" required />
              </div>
              <div className="form-group">
                <label><FontAwesomeIcon icon={faVenusMars} /> Genre *</label>
                <select name="genre" value={formData.genre} onChange={handleChange}>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
              <div className="form-group">
                <label><FontAwesomeIcon icon={faIdCard} /> Numéro CIN *</label>
                <input type="text" name="numero_cin" value={formData.numero_cin} onChange={handleChange} placeholder="Ex: 123456789" required />
              </div>
              <div className="form-group">
                <label><FontAwesomeIcon icon={faPhone} /> Téléphone</label>
                <input type="tel" name="tel" value={formData.tel} onChange={handleChange} placeholder="+261 32 12 345 67" />
              </div>
              <div className="form-group">
                <label><FontAwesomeIcon icon={faCalendarAlt} /> Date de naissance *</label>
                <input type="date" name="date_naissance" value={formData.date_naissance} onChange={handleChange} required />
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="step-content">
            <div className="info-box">
              <FontAwesomeIcon icon={faInfoCircle} />
              <span>Informations professionnelles du personnel</span>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label><FontAwesomeIcon icon={faCalendarAlt} /> Date d'entrée *</label>
                <input type="date" name="date_entree" value={formData.date_entree} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label><FontAwesomeIcon icon={faExchangeAlt} /> Motif d'entrée</label>
                <input type="text" name="motif_entree" value={formData.motif_entree} onChange={handleChange} placeholder="Recrutement, Mutation..." />
              </div>
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
                    <option key={s.id_service} value={s.id_service}>{s.nom_service}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label><FontAwesomeIcon icon={faBriefcase} /> Poste *</label>
                <select 
                  name="id_poste" 
                  value={formData.id_poste} 
                  onChange={handleChange} 
                  required 
                  disabled={!formData.id_service}
                >
                  <option value="">
                    {formData.id_service ? "Sélectionner un poste" : "Choisissez d'abord un service"}
                  </option>
                  {filteredPostes.map(p => (
                    <option key={p.id_poste} value={p.id_poste}>{p.titre_poste}</option>
                  ))}
                </select>
              </div>
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
            <div className="form-grid">
              <div className="form-group">
                <label><FontAwesomeIcon icon={faLayerGroup} /> Catégorie *</label>
                <select name="categorie" value={formData.categorie} onChange={handleChange} required>
                  <option value="">(vide)</option>
                  <option value="I">I</option>
                  <option value="II">II</option>
                  <option value="III">III</option>
                  <option value="IV">IV</option>
                  <option value="V">V</option>
                  <option value="VI">VI</option>
                  <option value="VII">VII</option>
                  <option value="VIII">VIII</option>
                  <option value="IX">IX</option>
                  <option value="X">X</option>
                  <option value="#N/A">#N/A</option>
                </select>
              </div>
              <div className="form-group">
                <label><FontAwesomeIcon icon={faTag} /> Indice *</label>
                <input type="text" name="indice" value={formData.indice} onChange={handleChange} placeholder="Ex: 450, 430, 380..." required />
              </div>
              <div className="form-group">
                <label><FontAwesomeIcon icon={faGraduationCap} /> Corps *</label>
                <input type="text" name="corps" value={formData.corps} onChange={handleChange} placeholder="Ex: Ingénieur des Travaux Statistiques..." required />
              </div>
              <div className="form-group">
                <label><FontAwesomeIcon icon={faGraduationCap} /> Grade *</label>
                <input type="text" name="grade" value={formData.grade} onChange={handleChange} placeholder="Ex: Ingénieur Principal, Technicien..." required />
              </div>
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
            <div className="info-box">
              <FontAwesomeIcon icon={faInfoCircle} />
              <span>Situation administrative du personnel</span>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label><FontAwesomeIcon icon={faUserCheck} /> Statut administratif</label>
                <select name="id_statut" value={formData.id_statut} onChange={handleChange}>
                  <option value="actif">Fonctionnaire</option>
                  <option value="inactif">Prive</option>
                </select>
              </div>
              <div className="form-group">
                <label><FontAwesomeIcon icon={faCheckCircle} /> État *</label>
                <select name="id_etat" value={formData.id_etat} onChange={handleChange} required>
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>
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
                <label><FontAwesomeIcon icon={faCalendarAlt} /> Date effet situation</label>
                <input type="date" name="date_situation" value={formData.date_situation} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label><FontAwesomeIcon icon={faBuilding} /> Destination</label>
                <input type="text" name="destination" value={formData.destination} onChange={handleChange} placeholder="Nouveau ministère/institut" />
              </div>
              <div className="form-group">
                <label><FontAwesomeIcon icon={faComment} /> Commentaire</label>
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
            <div className="form-grid">
              <div className="form-group">
                <label><FontAwesomeIcon icon={faBriefcase} /> Ancien poste</label>
                <input type="text" name="ancien_poste" value={formData.ancien_poste} onChange={handleChange} placeholder="Ex: Développeur, Technicien..." />
              </div>
              <div className="form-group">
                <label><FontAwesomeIcon icon={faBuilding} /> Ancienne direction</label>
                <input type="text" name="ancien_direction" value={formData.ancien_direction} onChange={handleChange} placeholder="Ex: DSIC, DG..." />
              </div>
              <div className="form-group full-width">
                <label><FontAwesomeIcon icon={faComment} /> Commentaire / Motif du changement</label>
                <input type="text" name="commentaire_historique" value={formData.commentaire_historique} onChange={handleChange} />
              </div>
            </div>
            <div className="summary-box">
              <h4>Récapitulatif du recrutement</h4>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">Nom complet :</span>
                  <span className="summary-value">{formData.nom} {formData.prenom}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">CIN :</span>
                  <span className="summary-value">{formData.numero_cin}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Direction :</span>
                  <span className="summary-value">{directions.find(d => d.id_direction.toString() === formData.id_direction)?.nom_direction || '-'}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Service :</span>
                  <span className="summary-value">{services.find(s => s.id_service.toString() === formData.id_service)?.nom_service || '-'}</span>
                </div>
                <div className="summary-item">
                   <span className="summary-label">Poste :</span>
                  <span className="summary-value">{filteredPostes.find((p: Poste) => p.id_poste.toString() === formData.id_poste)?.titre_poste || '-'}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Carrière :</span>
                  <span className="summary-value">{formData.categorie} - {formData.corps} ({formData.grade})</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      default: return null;
    }
  };

  return (
    <div className="recrutement-page">
      {successMessage && (
        <div className="success-toast">
          <FontAwesomeIcon icon={faCheck} />
          {successMessage}
        </div>
      )}

      <div className="recrutement-header">
        <h1>
          <FontAwesomeIcon icon={faUserPlus} />
          Nouveau recrutement
        </h1>
        <p>Ajoutez un nouveau personnel en remplissant les informations ci-dessous</p>
      </div>

      {/* Steps Indicator - Version cliquable */}
      <div className="steps-container">
        {steps.map((step) => (
          <div 
            key={step.number} 
            className={`step-wrapper ${currentStep >= step.number ? 'completed' : ''}`}
            onClick={() => goToStep(step.number)}
            style={{ cursor: currentStep >= step.number ? 'pointer' : 'not-allowed' }}
          >
            <div className={`step-circle ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'done' : ''}`}>
              {currentStep > step.number ? (
                <FontAwesomeIcon icon={faCheck} />
              ) : (
                <FontAwesomeIcon icon={step.icon} />
              )}
            </div>
            <span className="step-label">{step.title}</span>
            {step.number < steps.length && <div className="step-connector"></div>}
          </div>
        ))}
      </div>

      {/* Form Card */}
      <div className="recrutement-card">
        <form onSubmit={(e) => e.preventDefault()}>
          {renderStep()}
          
          <div className="form-navigation">
            {currentStep > 1 && (
              <button type="button" className="btn-prev" onClick={prevStep}>
                <FontAwesomeIcon icon={faArrowLeft} />
                Précédent
              </button>
            )}
            {currentStep < 5 ? (
              <button type="button" className="btn-next" onClick={nextStep}>
                Suivant
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            ) : (
              <button type="button" className="btn-submit" onClick={handleSubmit} disabled={loading}>
                <FontAwesomeIcon icon={faSave} />
                {loading ? 'Enregistrement...' : 'Enregistrer le personnel'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Recrutement;
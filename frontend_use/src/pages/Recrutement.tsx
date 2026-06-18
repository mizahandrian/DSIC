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
  faUserPlus, faComment, faHome, faToggleOn, faToggleOff
} from '@fortawesome/free-solid-svg-icons';
import api from '../Service/api';
import { triggerNotification } from '../components/NotificationBell';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

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
  id_direction: number;
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
    statut: 'actif', // Nouvel état : 'actif' ou 'inactif'
    
    // Étape 4 - Historique / Parcours professionnel
    ancien_employeur: '',
    ancien_poste: '',
    ancien_direction: '',
    ancien_categorie: '',
    ancien_grade: '',
    ancien_corps: '',
    ancien_indice: '',
    date_debut_ancien: '',
    date_fin_ancien: '',
    motif_depart: '',
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
      const [dirRes, servicesRes] = await Promise.all([
        api.get('/directions'),
        api.get('/services/direction/1'),
      ]);
      setDirections(dirRes.data);
      setServices(servicesRes.data);
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
        if (!formData.id_poste) return 'Le poste est requis.';
        return null;
      case 3:
        if (!formData.categorie) return 'La catégorie est requise.';
        if (!formData.indice.trim()) return 'L’indice est requis.';
        if (!formData.corps.trim()) return 'Le corps est requis.';
        if (!formData.grade.trim()) return 'Le grade est requis.';
        if (!formData.date_effet_carriere) return 'La date d’effet de carrière est requise.';
        return null;
      default:
        return null;
    }
  };

  const validateAllSteps = (): string | null => {
    for (let step = 1; step <= 3; step += 1) {
      const error = validateStep(step);
      if (error) return error;
    }
    return null;
  };

  const goToStep = (stepNumber: number) => {
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
        // Identité
        matricule: formData.matricule.trim() || null,
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        genre: formData.genre,
        numero_cin: formData.numero_cin.trim(),
        tel: formData.tel?.trim() || null,
        date_naissance: formData.date_naissance,
        
        // Professionnel
        date_entree: formData.date_entree,
        motif_entree: formData.motif_entree?.trim() || null,
        id_direction: formData.id_direction ? Number(formData.id_direction) : null,
        id_service: formData.id_service ? Number(formData.id_service) : null,
        id_poste: formData.id_poste ? Number(formData.id_poste) : null,
        
        // Carrière
        categorie: formData.categorie?.trim() || null,
        indice: formData.indice || null,
        corps: formData.corps?.trim() || null,
        grade: formData.grade?.trim() || null,
        date_effet_carriere: formData.date_effet_carriere || null,
        statut: formData.statut, // Ajout du statut
        etat: formData.statut, // Envoi également le statut comme état
        
        // Historique / Ancienneté
        ancien_employeur: formData.ancien_employeur || null,
        ancien_poste: formData.ancien_poste || null,
        ancien_direction: formData.ancien_direction || null,
        ancien_categorie: formData.ancien_categorie || null,
        ancien_grade: formData.ancien_grade || null,
        ancien_corps: formData.ancien_corps || null,
        ancien_indice: formData.ancien_indice || null,
        date_debut_ancien: formData.date_debut_ancien || null,
        date_fin_ancien: formData.date_fin_ancien || null,
        motif_depart: formData.motif_depart || null,
        commentaire_historique: formData.commentaire_historique || null,
      };

      await api.post('/recrutement', personnelData);
      
      triggerNotification(
        'success',
        '✅ Nouveau personnel ajouté',
        `${formData.prenom} ${formData.nom} a été recruté avec succès`,
        '/gestion-personnels'
      );
      
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
      statut: 'actif',
      ancien_employeur: '', ancien_poste: '', ancien_direction: '', ancien_categorie: '',
      ancien_grade: '', ancien_corps: '', ancien_indice: '',
      date_debut_ancien: '', date_fin_ancien: '', motif_depart: '', commentaire_historique: '',
    });
  };

  const nextStep = () => {
    const error = validateStep(currentStep);
    if (error) {
      alert(error);
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const steps = [
    { number: 1, title: 'Identité', icon: faUser },
    { number: 2, title: 'Professionnel', icon: faBriefcase },
    { number: 3, title: 'Carrière', icon: faChartLine },
    { number: 4, title: 'Parcours', icon: faHistory },
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
                <label><FontAwesomeIcon icon={faUser} /> Nom *</label>
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
                  <option value="">Sélectionner</option>
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
                <input type="text" name="indice" value={formData.indice} onChange={handleChange} placeholder="Ex: 450, 430..." required />
              </div>
              <div className="form-group">
                <label><FontAwesomeIcon icon={faGraduationCap} /> Corps *</label>
                <input type="text" name="corps" value={formData.corps} onChange={handleChange} placeholder="Ex: Ingénieur des Travaux..." required />
              </div>
              <div className="form-group">
                <label><FontAwesomeIcon icon={faGraduationCap} /> Grade *</label>
                <input type="text" name="grade" value={formData.grade} onChange={handleChange} placeholder="Ex: Ingénieur Principal..." required />
              </div>
              <div className="form-group">
                <label><FontAwesomeIcon icon={faCalendarAlt} /> Date d'effet *</label>
                <input type="date" name="date_effet_carriere" value={formData.date_effet_carriere} onChange={handleChange} required />
              </div>
              <div className="form-group statut-group">
                <label><FontAwesomeIcon icon={formData.statut === 'actif' ? faToggleOn : faToggleOff} /> Statut *</label>
                <div className="statut-toggle">
                  <button 
                    type="button" 
                    className={`statut-btn ${formData.statut === 'actif' ? 'active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, statut: 'actif' }))}
                  >
                    <FontAwesomeIcon icon={faCheck} />
                    Actif
                  </button>
                  <button 
                    type="button" 
                    className={`statut-btn ${formData.statut === 'inactif' ? 'inactive' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, statut: 'inactif' }))}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                    Inactif
                  </button>
                </div>
                <div className="statut-indicator">
                  {formData.statut === 'actif' ? (
                    <span className="badge badge-success">
                      <FontAwesomeIcon icon={faCheckCircle} /> Actif
                    </span>
                  ) : (
                    <span className="badge badge-danger">
                      <FontAwesomeIcon icon={faTimesCircle} /> Inactif
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="step-content">
            <div className="info-box">
              <FontAwesomeIcon icon={faInfoCircle} />
              <span>Parcours professionnel avant INSTAT</span>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label><FontAwesomeIcon icon={faHome} /> Employeur précédent</label>
                <input type="text" name="ancien_employeur" value={formData.ancien_employeur} onChange={handleChange} placeholder="Ex: Ministère, Université, Entreprise..." />
              </div>
              <div className="form-group">
                <label><FontAwesomeIcon icon={faBriefcase} /> Ancien poste</label>
                <input type="text" name="ancien_poste" value={formData.ancien_poste} onChange={handleChange} placeholder="Ex: Développeur, Technicien..." />
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label><FontAwesomeIcon icon={faBuilding} /> Ancienne direction</label>
                <input type="text" name="ancien_direction" value={formData.ancien_direction} onChange={handleChange} placeholder="Ex: DSIC, DG..." />
              </div>
              <div className="form-group">
                <label><FontAwesomeIcon icon={faLayerGroup} /> Ancienne catégorie</label>
                <select name="ancien_categorie" value={formData.ancien_categorie} onChange={handleChange}>
                  <option value="">Sélectionner</option>
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
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label><FontAwesomeIcon icon={faGraduationCap} /> Ancien grade</label>
                <input type="text" name="ancien_grade" value={formData.ancien_grade} onChange={handleChange} placeholder="Ex: Ingénieur Principal, Technicien..." />
              </div>
              <div className="form-group">
                <label><FontAwesomeIcon icon={faTag} /> Ancien indice</label>
                <input type="text" name="ancien_indice" value={formData.ancien_indice} onChange={handleChange} placeholder="Ex: 450, 430..." />
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label><FontAwesomeIcon icon={faGraduationCap} /> Ancien corps</label>
                <input type="text" name="ancien_corps" value={formData.ancien_corps} onChange={handleChange} placeholder="Ex: Ingénieur des Travaux..." />
              </div>
              <div className="form-group">
                <label><FontAwesomeIcon icon={faCalendarAlt} /> Période début</label>
                <input type="date" name="date_debut_ancien" value={formData.date_debut_ancien} onChange={handleChange} />
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label><FontAwesomeIcon icon={faCalendarAlt} /> Période fin</label>
                <input type="date" name="date_fin_ancien" value={formData.date_fin_ancien} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label><FontAwesomeIcon icon={faComment} /> Motif du départ</label>
                <input type="text" name="motif_depart" value={formData.motif_depart} onChange={handleChange} placeholder="Ex: Mutation, Démission, Fin de contrat..." />
              </div>
            </div>
            <div className="form-group full-width">
              <label><FontAwesomeIcon icon={faComment} /> Commentaire / Observations</label>
              <input type="text" name="commentaire_historique" value={formData.commentaire_historique} onChange={handleChange} />
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
                <div className="summary-item">
                  <span className="summary-label">Statut :</span>
                  <span className={`summary-value ${formData.statut === 'actif' ? 'text-success' : 'text-danger'}`}>
                    {formData.statut === 'actif' ? '✅ Actif' : '❌ Inactif'}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Ancien employeur :</span>
                  <span className="summary-value">{formData.ancien_employeur || '-'}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Ancien poste :</span>
                  <span className="summary-value">{formData.ancien_poste || '-'}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Ancienne direction :</span>
                  <span className="summary-value">{formData.ancien_direction || '-'}</span>
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
            {currentStep < 4 ? (
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
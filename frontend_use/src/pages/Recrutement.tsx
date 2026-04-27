// src/pages/Recrutement.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faIdCard, faPhone, faVenusMars, faCalendarAlt,
  faBuilding, faBriefcase, faUserTie, faChartLine,
  faCheckCircle, faHistory, faArrowLeft, faArrowRight,
  faSave, faUserCheck, faExchangeAlt, faInfoCircle
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

interface Poste {
  id_poste: number;
  titre_poste: string;
}

interface Carriere {
  id_carriere: number;
  categorie: string;
  corps: string;
  grade: string;
}

interface Statut {
  id_statut: number;
  nom_statut: string;
  type_statut: string;
}

interface Etat {
  id_etat: number;
  nom_etat: string;
}

const Recrutement: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Données principales
  const [directions, setDirections] = useState<Direction[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [postes, setPostes] = useState<Poste[]>([]);
  const [carrieres, setCarrieres] = useState<Carriere[]>([]);
  const [statuts, setStatuts] = useState<Statut[]>([]);
  const [etats, setEtats] = useState<Etat[]>([]);

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
    id_poste: '',
    id_carriere: '',
    
    // Étape 3 - Statut
    id_statut: '',
    id_etat: '1',
    situation: 'activite',
    date_situation: '',
    destination: '',
    commentaire_situation: '',
    
    // Étape 4 - Historique
    ancien_poste: '',
    ancien_direction: '',
    commentaire_historique: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  // Filtrer les services quand la direction change
  useEffect(() => {
    if (formData.id_direction) {
      const filtered = services.filter(s => s.id_direction === parseInt(formData.id_direction));
      setFilteredServices(filtered);
      // Réinitialiser le service sélectionné
      setFormData(prev => ({ ...prev, id_service: '' }));
    } else {
      setFilteredServices([]);
    }
  }, [formData.id_direction, services]);

  const fetchData = async () => {
    try {
      const [dirRes, servicesRes, postesRes, carrieresRes, statutsRes, etatsRes] = await Promise.all([
        api.get('/directions'),
        api.get('/services'),
        api.get('/postes'),
        api.get('/carrieres'),
        api.get('/statuts'),
        api.get('/etats')
      ]);
      setDirections(dirRes.data);
      setServices(servicesRes.data);
      setPostes(postesRes.data);
      setCarrieres(carrieresRes.data);
      setStatuts(statutsRes.data);
      setEtats(etatsRes.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const personnelData = {
        nom: formData.nom,
        prenom: formData.prenom,
        genre: formData.genre,
        numero_cin: formData.numero_cin,
        tel: formData.tel,
        date_naissance: formData.date_naissance,
        date_entree: formData.date_entree,
        motif_entree: formData.motif_entree,
        id_direction: parseInt(formData.id_direction),
        id_service: parseInt(formData.id_service),
        id_poste: parseInt(formData.id_poste),
        id_carriere: parseInt(formData.id_carriere),
        id_etat: parseInt(formData.id_etat),
        statuts: formData.id_statut ? [parseInt(formData.id_statut)] : [],
        situation_admin: formData.situation,
        date_entrer_situation: formData.date_situation,
        destination: formData.destination,
        commentaire_situation: formData.commentaire_situation,
      };
      
      const response = await api.post('/personnels', personnelData);
      const personnelId = response.data.id_personnel;
      
      if (formData.ancien_poste || formData.ancien_direction) {
        await api.post('/historiques', {
          id_personnel: personnelId,
          ancien_poste: formData.ancien_poste,
          ancien_direction: formData.ancien_direction,
          motif_changement: formData.commentaire_historique,
          date_changement: new Date().toISOString().split('T')[0]
        });
      }
      
      alert('Personnel ajouté avec succès !');
      navigate('/gestion-personnels');
      resetForm();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      nom: '', prenom: '', genre: 'M', numero_cin: '', tel: '', date_naissance: '',
      date_entree: '', motif_entree: '', id_direction: '', id_service: '', id_poste: '', id_carriere: '',
      id_statut: '', id_etat: '1', situation: 'activite', date_situation: '', destination: '', commentaire_situation: '',
      ancien_poste: '', ancien_direction: '', commentaire_historique: '',
    });
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const steps = [
    { number: 1, title: 'Identité', icon: faUser },
    { number: 2, title: 'Professionnel', icon: faBriefcase },
    { number: 3, title: 'Statut', icon: faUserCheck },
    { number: 4, title: 'Historique', icon: faHistory },
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
                  {filteredServices.map(s => <option key={s.id_service} value={s.id_service}>{s.nom_service}</option>)}
                </select>
                {filteredServices.length === 0 && formData.id_direction && (
                  <small className="hint-text">⚠️ Aucun service dans cette direction. Veuillez en créer dans la page "Services".</small>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label><FontAwesomeIcon icon={faUserTie} /> Poste *</label>
                <select name="id_poste" value={formData.id_poste} onChange={handleChange} required>
                  <option value="">Sélectionner</option>
                  {postes.map(p => <option key={p.id_poste} value={p.id_poste}>{p.titre_poste}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label><FontAwesomeIcon icon={faChartLine} /> Carrière *</label>
                <select name="id_carriere" value={formData.id_carriere} onChange={handleChange} required>
                  <option value="">Sélectionner</option>
                  {carrieres.map(c => <option key={c.id_carriere} value={c.id_carriere}>{c.categorie} - {c.corps}</option>)}
                </select>
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="step-content">
            <div className="form-row">
              <div className="form-group">
                <label><FontAwesomeIcon icon={faUserCheck} /> Statut administratif</label>
                <select name="id_statut" value={formData.id_statut} onChange={handleChange}>
                  <option value="">Sélectionner</option>
                  {statuts.map(s => <option key={s.id_statut} value={s.id_statut}>{s.nom_statut} ({s.type_statut})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label><FontAwesomeIcon icon={faCheckCircle} /> État *</label>
                <select name="id_etat" value={formData.id_etat} onChange={handleChange} required>
                  {etats.map(e => <option key={e.id_etat} value={e.id_etat}>{e.nom_etat}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label><FontAwesomeIcon icon={faExchangeAlt} /> Situation</label>
                <select name="situation" value={formData.situation} onChange={handleChange}>
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
      
      case 4:
        return (
          <div className="step-content">
            <div className="info-box">
              <FontAwesomeIcon icon={faInfoCircle} />
              <span>Ces informations concernent l'historique du personnel avant son arrivée</span>
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
              <p>Poste: {postes.find(p => p.id_poste.toString() === formData.id_poste)?.titre_poste || '-'}</p>
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
          {currentStep < 4 ? (
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
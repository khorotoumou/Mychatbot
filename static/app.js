const chatWindow = document.getElementById('chat-window');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatbotIcon = document.getElementById('chatbot-icon');
const floatingChatContainer = document.getElementById('floating-chat-container');
const closeChatBtn = document.getElementById('close-chat-btn');

const normalizeText = (raw) => {
  if (!raw) return "";
  return raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const DEADLINE_TOPICS = [
  {
    id: 'benefices',
    label: 'Échéances bénéfices',
    keywords: ['benefices', 'bic', 'bnc', 'ba', 'impot benefices'],
    options: [
      {
        id: 'benefices_regime_general',
        label: 'Régime général',
        options: [
          {
            id:'Déclaration de résultat',
            label:'Déclaration de résultat',
            answer:`Entreprises soumises à l'impôt sur les bénéfices 
              industriels et commerciaux, bénéfices agricoles : 
              • 30 juin suivant la date de clôture de l'exercice comptable, pour les entreprises soumises à 
              l'obligation de certification de leurs comptes par un commissaire aux comptes ; 
              • 30 mai suivant la date de clôture de l'exercice comptable, pour les autres entreprises.

              Entreprises soumises à l'impôt sur les bénéfices non commerciaux : 
              • 15 avril de chaque année pour les entreprises relevant des SAID : 
              • 20 avril pour les entreprises relevant de la DGE ou de la DME.`
          },
          {
            id:'Dépôt des états financiers',
            label:'Dépôt des états financiers',
            answer:`Entreprises soumises à l'impôt sur les bénéfices industriels et commerciaux, bénéfices agricoles : 
              • 30 juin suivant la date de clôture de l'exercice comptable, pour les entreprises soumises à 
              l'obligation de certification de leurs comptes par un commissaire aux comptes ; 
              • 30 mai suivant la date de clôture de l'exercice comptable, pour les autres entreprises. 

              Entreprises soumises à l'impôt sur les bénéfices non commerciaux : 
              • au plus tard le 30 mai suivant la date de clôture 
              de l'exercice.`
          },
        ]
        
      },
      {
        id: 'benefices_retenues',
        label: 'Retenues à la source au titre de limpôt sur les bénéfices...',
        answer: `Entreprises relevant des SAID: 15 du mois pour les sommes versées au 
cours du mois précédent. 
Entreprises relevant de la DGE ou de la DME : 
• 10 du mois suivant, pour les entreprises industrielles, pétrolières et 
minières : 
• 15 du mois suivant, pour les entreprises commerciales : 
• 20 du mois suivant, pour les entreprises de prestations de services.`
      }
    ]
  },
  {
    id: 'salaires',
    label: 'Échéances salaires, pensions et rentes viageres(ITS)',
    keywords: ['salaire', 'its', 'pension', 'rente viagere'],
    options: [
      {
        id: 'salaires_retenues',
        label: 'Déclaration et paiement',
        answer: `Pour les déclarations et les paiements :
• 15 du mois suivant, pour les contribuables soumis à un régime du réel 
d'imposi-tion. 
Entreprises relevant de la DGE ou de la DME : 
• 10 du mois suivant, pour les entreprises industrielles, pétrolières et 
minières : 
• 15 du mois suivant, pour les entreprises commerciales ; 
• 20 du mois suivant, pour les entreprises de prestations de services.
 
Pour les contribuables relevant du régime de l'entreprenant et du 
régime des microentreprises : 
• Déclaration: au plus tard le 15 janvier de chaque année: 
• paiement: au plus tard le 10 de chaque mois.`
      },
      {
        id: 'salaires_regime_general',
        label: 'Dépôt de lEtat récapitulatif annuel des salaires versés',
        answer: `Pour les dépôts... :
• 30 juin pour les entreprises soumises à l'obligation de certification de 
leurs comptes par un commissaire aux comptes ; 
• 30 mai de chaque année pour les autres entreprises, les particuliers et 
les associations.`
      }
    ]
  },
  {
    id: 'foncier',
    label: 'Échéances foncier',
    keywords: ['foncier', 'impot foncier', 'declaration fonciere'],
    options: [
      {
        id: 'foncier_regime_general',
        label: 'Régime général',
        answer: `Déclaration foncière annuelle :
• Personnes physiques : du 1er octobre au 30 novembre (déclaration initiale, complétée en cas de modification).
• Entreprises et personnes morales : 15 janvier.
• Entreprises relevant de la DGE ou de la DME – industrielles, pétrolières et minières : 10 janvier.
• Entreprises relevant de la DGE ou de la DME – commerciales : 15 janvier.
• Entreprises relevant de la DGE ou de la DME – prestations de services : 20 janvier.

Paiement de l'impôt foncier :
• Personnes physiques : 15 mars, 15 juin, 15 septembre, 15 décembre.
• Entreprises individuelles et personnes morales : 15 mars et 15 juin.`
      },
      {
        id: 'foncier_retenues',
        label: 'Retenues à la source',
        answer: `Aucune retenue à la source n'est prévue pour l'impôt foncier. Les obligations se gèrent exclusivement dans le cadre du régime général (déclaration annuelle et paiement aux échéances indiquées).`
      }
    ]
  },
  {
    id: 'revenus_locatifs_capitaux',
    label: 'Échéances revenus des capitaux mobileres(IRCM)',
    keywords: ['revenus capitaux', 'ircm', 'revenus locatifs', 'revenus mobiliers'],
    options: [
      {
        id: 'revenus_retenues',
        label: 'Retenues à la source',
        answer: `Retenues à la source – Revenus locatifs :
• Reversement des prélèvements opérés : 15 du mois suivant le versement du loyer.`
      },
      {
        id: 'revenus_regime_general',
        label: 'Régime général (IRCM)',
        answer: `Impôt sur le revenu des créances (IRC) :
• Déclaration et paiement : 15 du mois suivant la date de paiement effectif des intérêts ou la date d'échéance contractuelle.
• Entreprises relevant de la DGE ou de la DME : 10 (industriels/pétroliers/miniers), 15 (commerciaux) ou 20 (services) du mois suivant.

Impôt sur le revenu des valeurs mobilières (IRVM) :
• Produits à revenu fixe (obligations, emprunts, titres assimilés) : 15 janvier pour les produits échus au cours de l'année précédente.
• Actions, parts d'intérêts, commandites : 15 du mois suivant la distribution ou dans les 3 mois du procès-verbal de l'assemblée ayant décidé la distribution.
• Lots, primes de remboursement, rémunérations des membres des conseils d'administration : 15 janvier, 15 avril, 15 juillet, 15 octobre.
• Entreprises relevant de la DGE ou de la DME : 10 octobre (industriels/pétroliers/miniers), 15 octobre (commerciaux), 20 octobre (services).`
      }
    ]
  },
  {
    id: 'igr_patentes',
    label: 'Échéances IGR & patentes',
    keywords: ['igr', 'impot general sur le revenu', 'patente', 'licence', 'exploitant forestier'],
    answer: `Impôt général sur le revenu – Retenues à la source d'IGR :
• Exploitants forestiers : 15 du mois suivant les sommes versées.

Contribution des patentes et licences – Régime général :
• Déclaration : 15 mars pour les entreprises relevant des SAID.
• DGE/DME : 10 mars (industriels/pétroliers/miniers), 15 mars (commerciaux), 20 mars (services).
• Paiement : 1ère moitié 15 mars, 2ᵉ moitié 15 juillet.
• DGE/DME : 10 mars & 10 juillet (industriels/pétroliers/miniers), 15/15 (commerciaux) ou 20/20 (services) mars & juillet.

Cas particuliers :
• Entreprises nouvelles (>1 Md de CA prévisionnel) : déclaration & paiement avant le démarrage.
• Patente véhicules de transport : 1er mars et 20 mai.
• Patente acheteurs de produits locaux : dans les 15 jours après l'ouverture officielle de la campagne.`
  }
];

const FAQ_ENTRIES = [
  {
    id: 'tva_info',
    title: "Qu'est-ce que la TVA",
    keywords: ['tva', 'taxe sur la valeur ajoutée', "qu'est-ce que la tva", 'définition tva', 'taux tva', 'calcul tva'],
    answer: `La TVA (Taxe sur la Valeur Ajoutée) est un impôt indirect sur la consommation. Elle s'applique sur la plupart des biens et services vendus en Côte d'Ivoire. Les taux principaux sont : 18 % (taux normal), 9 % (taux réduit pour certains produits de première nécessité) et 0 % (exonérations). La TVA est collectée par les entreprises et reversée à l'État. Pour plus de détails, consultez le Code Général des Impôts.`,
    links: [
      { label: 'Code Général des Impôts', href: 'https://www.e-impots.gouv.ci' },
      { label: 'Guide TVA', href: 'https://www.e-impots.gouv.ci' }
    ]
  },
  {
    id: 'salutations',
    title: 'Salutations et politesse',
    keywords: ['bonjour', 'bonsoir', 'salut', 'merci', 'au revoir', 'comment allez-vous', 'ça va'],
    answer: `Bonjour ! Je suis l'assistant virtuel de la DGI Côte d'Ivoire. Je peux vous aider sur la télédéclaration, le télépaiement, les échéances fiscales et les services en ligne e-impots.`
  },
  {
    id: 'remerciements',
    title: 'Remerciements',
    keywords: ['merci', 'merci beaucoup', 'parfait', 'excellent', 'super', 'génial'],
    answer: `Avec plaisir ! N'hésitez pas à poser d'autres questions. Pour toute demande personnelle, connectez-vous à votre espace sécurisé e-impots.`,
    links: [
      { label: 'Portail e-impots', href: 'https://www.e-impots.gouv.ci' }
    ]
  },
  {
    id: 'num_teledeclarant',
    keywords: ['télédéclarant', 'teledeclarant', 'numero teledeclarant', 'identifiant e-impots', 'numero declarant'],
    title: 'Obtenir le numéro de télédéclarant',
    answer: `Pour obtenir votre numéro de télédéclarant :
1. Rassemblez les pièces (pièce d'identité, RCCM si personne morale, etc.).
2. Déposez la demande au Centre des Téléservices Fiscaux (CTF) ou via le formulaire en ligne.
3. Après validation, vous recevez l'identifiant par le canal officiel.`,
    links: [
      { label: 'Portail e-impots', href: 'https://www.e-impots.gouv.ci' }
    ]
  },
  {
    id: 'adhesion_plateforme',
    title: 'Adhésion à la plateforme',
    keywords: ['adhésion', 'adhesion', 'inscription', 'créer compte', "s'enregistrer", 'enregistrement'],
    answer: `Étapes :
1. Rendez-vous sur le portail e-impots et cliquez sur « S'inscrire ».
2. Renseignez les informations demandées (NIF, email, mot de passe).
3. Validez, puis activez le compte via le lien reçu par email.
4. Connectez-vous pour compléter votre profil.`,
    links: [
      { label: "S'inscrire", href: 'https://www.e-impots.gouv.ci' }
    ]
  },
  {
    id: 'problemes_connexion',
    title: 'Problèmes de connexion',
    keywords: ['connexion', 'mot de passe', 'compte bloqué', 'login', 'se connecter', 'probleme connexion'],
    answer: `En cas de difficulté :
• Utilisez « Mot de passe oublié ».
• Vérifiez l'adresse email ou l'identifiant fiscal saisi.
• Patientez 15 minutes si le compte est bloqué.
• Videz le cache du navigateur et réessayez.
• Contactez le CTF si le problème persiste.`,
    links: [
      { label: 'Mot de passe oublié', href: 'https://www.e-impots.gouv.ci' }
    ]
  },
  {
    id: 'declaration_fiscale',
    title: 'Réaliser une déclaration fiscale',
    keywords: ['déclaration', 'declaration', 'bic', 'bnc', 'salaires', 'télédéclaration', 'teledeclaration', 'declarer'],
    answer: `Dans votre espace e-impots, choisissez le type d'impôt (BIC, BNC, salaires, TVA...). Renseignez les montants, validez et téléchargez l'accusé de réception.`,
    links: [
      { label: 'Accéder à la télédéclaration', href: 'https://www.e-impots.gouv.ci' }
    ]
  },
  {
    id: 'telepaiement',
    title: 'Paiement en ligne',
    keywords: ['paiement', 'télépaiement', 'telepaiement', 'payer en ligne', 'moyens de paiement', 'payer impot'],
    answer: `Après validation d'une déclaration, choisissez « Payer ». Sélectionnez un mode de règlement (carte bancaire, virement, mobile money si disponible), vérifiez les références et confirmez.`,
    links: [
      { label: 'Procédure télépaiement', href: 'https://www.e-impots.gouv.ci' }
    ]
  },
  {
    id: 'tva',
    title: 'Taxe sur la Valeur Ajoutée (TVA)',
    keywords: ['tva', 'taxe valeur ajoutée', "tva côte d'ivoire", 'taux tva', 'déclaration tva', 'tva entreprise'],
    answer: `La TVA est un impôt collecté par les entreprises assujetties. En Côte d'Ivoire, le taux normal est 18 %. Les déclarations et paiements se font généralement avant le 15 du mois suivant.`,
    links: [
      { label: 'Guide TVA', href: 'https://www.e-impots.gouv.ci' },
      { label: 'Déclaration TVA', href: 'https://www.e-impots.gouv.ci' }
    ]
  },
  {
    id: 'impot_revenus',
    title: 'Impôt sur le revenu',
    keywords: ['impôt revenu', 'barème impôt', 'fiscalité revenus', 'tranche impôt'],
    answer: `L'impôt sur le revenu s'applique aux personnes physiques (salaires, professions libérales, revenus fonciers, etc.). Les barèmes diffèrent selon la nature du revenu. Consultez votre espace e-impots pour les montants à déclarer et les taux applicables.`,
    links: [
      { label: 'Barèmes impôts', href: 'https://www.e-impots.gouv.ci' }
    ]
  },
  {
    id: 'echeances_general',
    title: 'Échéances fiscales',
    keywords: ['échéance fiscale', 'echeance fiscale', 'calendrier fiscal', 'dates limites impôts', 'planning fiscal'],
    answer: `Plusieurs familles d'échéances existent :
• Impôt sur les bénéfices (BIC, BNC, BA)
• Retenues salaires et ITS
• Impôt foncier
• Revenus locatifs & capitaux mobiliers
• IGR & patentes

Sélectionnez la catégorie via le bouton « Échéances » pour obtenir les dates détaillées.`,
    links: [
      { label: 'Calendrier personnalisé', href: 'https://www.e-impots.gouv.ci' }
    ]
  },
  {
    id: 'piece_jointe',
    title: 'Déposer des pièces jointes',
    keywords: ['pièce jointe', 'téléverser', 'upload document'],
    answer: `Dans la déclaration ou la rubrique « Mes documents », utilisez « Joindre un fichier ». Les formats PDF/JPG/PNG sont acceptés (veillez à la taille maximale indiquée).`
  },
  {
    id: 'contact_support',
    title: 'Contact assistance',
    keywords: ['contact', 'support', 'aide', 'assistance'],
    answer: `Pour joindre l'assistance :
• Utilisez le formulaire « Contact » en bas de page sur e-impots.
• Appelez le numéro indiqué en préparant votre NIF et la référence du dossier.`,
    links: [
      { label: 'Contact e-impots', href: 'https://www.e-impots.gouv.ci' }
    ]
  }
];

const DEADLINE_GENERAL_KEYWORDS = ['echeance', 'calendrier fiscal', 'dates limites impots', 'date limite impots', 'echeances fiscales', 'planning fiscal'];
const DEFAULT_FALLBACK = "Je n'ai pas encore la réponse. Utilisez les boutons d'accès rapide ou consultez le portail e-impots pour plus de détails.";

const deadlineMenuState = {
  active: false,
  container: null,
  mode: null,
  pendingTopic: null
};

function addMessage(role, text, links = [], source = "") {
  const row = document.createElement('div');
  row.className = `msg ${role} ${source}`;

  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  if (role === 'user') {
    avatar.textContent = 'U';
  } else {
    const img = document.createElement('img');
    img.src = 'static/icons8-chatbot-96.png';
    img.alt = 'Robot assistant';
    avatar.appendChild(img);
  }

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;

  if (links && links.length) {
    const linksWrap = document.createElement('div');
    linksWrap.className = 'links';
    for (const link of links) {
      const anchor = document.createElement('a');
      anchor.className = 'link';
      anchor.href = link.href;
      anchor.target = '_blank';
      anchor.rel = 'noopener';
      anchor.textContent = link.label;
      linksWrap.appendChild(anchor);
    }
    bubble.appendChild(linksWrap);
  }

  if (role === 'user') {
    row.appendChild(bubble);
    row.appendChild(avatar);
  } else {
    row.appendChild(avatar);
    row.appendChild(bubble);
  }

  chatWindow.appendChild(row);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return row;
}

const dismissDeadlineMenu = () => {
  if (deadlineMenuState.container) {
    deadlineMenuState.container.remove();
  }
  deadlineMenuState.active = false;
  deadlineMenuState.container = null;
  deadlineMenuState.mode = null;
  deadlineMenuState.pendingTopic = null;
};

const presentTopicOption = (topic, option) => {
  if (!topic || !option) return;
  dismissDeadlineMenu();
  addMessage('bot', option.answer, option.links || [], 'kb');
};

const handleTopicOptionSelection = (topic, option) => {
  if (!topic || !option) return;
  addMessage('user', option.label);
  
  // Vérifier si cette option a elle-même des sous-options
  if (option.options && option.options.length > 0) {
    showSubOptionMenu(topic, option);
  } else {
    presentTopicOption(topic, option);
  }
};

const showTopicOptionMenu = (topic) => {
  dismissDeadlineMenu();
  const row = addMessage('bot', `Merci de choisir le régime applicable pour "${topic.label}" :`);
  const bubble = row.querySelector('.bubble');
  const wrap = document.createElement('div');
  wrap.className = 'deadline-options';

  topic.options.forEach((option) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip deadline-chip';
    btn.textContent = option.label;
    btn.addEventListener('click', () => handleTopicOptionSelection(topic, option));
    wrap.appendChild(btn);
  });

  bubble.appendChild(wrap);
  deadlineMenuState.active = true;
  deadlineMenuState.container = wrap;
  deadlineMenuState.mode = 'options';
  deadlineMenuState.pendingTopic = topic;
};

// Nouvelle fonction pour afficher les sous-options (ex: Déclaration de résultat, Dépôt des états financiers)
const showSubOptionMenu = (topic, parentOption) => {
  dismissDeadlineMenu();
  const row = addMessage('bot', `Merci de préciser pour "${parentOption.label}" :`);
  const bubble = row.querySelector('.bubble');
  const wrap = document.createElement('div');
  wrap.className = 'deadline-options';

  parentOption.options.forEach((subOption) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip deadline-chip';
    btn.textContent = subOption.label;
    btn.addEventListener('click', () => {
      addMessage('user', subOption.label);
      presentTopicOption(topic, subOption);
    });
    wrap.appendChild(btn);
  });

  bubble.appendChild(wrap);
  deadlineMenuState.active = true;
  deadlineMenuState.container = wrap;
  deadlineMenuState.mode = 'sub-options';
  deadlineMenuState.pendingTopic = topic;
};

const presentDeadlineAnswer = (topic) => {
  if (!topic) return;
  if (topic.options && topic.options.length) {
    showTopicOptionMenu(topic);
    return;
  }
  dismissDeadlineMenu();
  addMessage('bot', topic.answer, topic.links || [], 'kb');
};

const handleDeadlineSelection = (topic) => {
  if (!topic) return;
  addMessage('user', topic.label);
  presentDeadlineAnswer(topic);
};

const showDeadlineMenu = () => {
  dismissDeadlineMenu();
  const row = addMessage('bot', "Merci de préciser le type d'échéance recherché :");
  const bubble = row.querySelector('.bubble');
  const wrap = document.createElement('div');
  wrap.className = 'deadline-options';

  DEADLINE_TOPICS.forEach((topic) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip deadline-chip';
    btn.textContent = topic.label;
    btn.addEventListener('click', () => handleDeadlineSelection(topic));
    wrap.appendChild(btn);
  });

  bubble.appendChild(wrap);
  deadlineMenuState.active = true;
  deadlineMenuState.container = wrap;
  deadlineMenuState.mode = 'topics';
};

const matchDeadlineTopic = (text) => {
  const normalized = normalizeText(text);
  if (!normalized) return null;
  return DEADLINE_TOPICS.find((topic) =>
    (topic.keywords || []).some((keyword) => normalized.includes(normalizeText(keyword)))
  );
};

const matchTopicOption = (topic, text) => {
  if (!topic || !topic.options) return null;
  const normalized = normalizeText(text);
  if (!normalized) return null;
  return (
    topic.options.find((option) => {
      const labelNorm = normalizeText(option.label);
      if (labelNorm && (labelNorm.includes(normalized) || normalized.includes(labelNorm))) {
        return true;
      }
      return (option.keywords || []).some((keyword) => normalized.includes(normalizeText(keyword)));
    }) || null
  );
};

const isDeadlineMenuRequest = (text) => {
  const normalized = normalizeText(text);
  if (!normalized) return false;
  if (matchDeadlineTopic(text)) return false;
  return DEADLINE_GENERAL_KEYWORDS.some((keyword) => normalized.includes(keyword));
};

const searchFaqEntry = (query) => {
  const normalized = normalizeText(query);
  if (!normalized || normalized.length < 3) return null; // Ignorer les requêtes trop courtes

  const keywordMatch = FAQ_ENTRIES.find((entry) =>
    (entry.keywords || []).some((kw) => {
      const kwNorm = normalizeText(kw);
      // Recherche exacte ou mot complet
      return kwNorm === normalized || 
             normalized.split(' ').includes(kwNorm) ||
             kwNorm.split(' ').some(word => word.length > 2 && normalized.includes(word));
    })
  );
  if (keywordMatch) {
    return keywordMatch;
  }

  return FAQ_ENTRIES.find((entry) => {
    const titleNorm = normalizeText(entry.title || '');
    return titleNorm && titleNorm.length > 2 && (titleNorm.includes(normalized) || normalized.includes(titleNorm));
  }) || null;
};

const respondWithFaq = (text) => {
  const entry = searchFaqEntry(text);
  if (entry) {
    addMessage('bot', entry.answer, entry.links || [], 'kb');
  } else {
    addMessage('bot', DEFAULT_FALLBACK, [
      { label: 'Portail e-impots', href: 'https://www.e-impots.gouv.ci' }
    ]);
  }
};

const processUserMessage = (text) => {
  console.log("Texte reçu :", text);
  const trimmed = text.trim();
  if (!trimmed) return;

  if (deadlineMenuState.active) {
    if (deadlineMenuState.mode === 'options' && deadlineMenuState.pendingTopic) {
      const option = matchTopicOption(deadlineMenuState.pendingTopic, trimmed);
      if (option) {
        presentTopicOption(deadlineMenuState.pendingTopic, option);
      } else {
        addMessage('bot', "Je n'ai pas reconnu ce régime. Merci d'utiliser les boutons proposés pour sélectionner une option.");
      }
      return;
    }

    if (deadlineMenuState.mode === 'topics') {
      const topic = matchDeadlineTopic(trimmed);
      if (topic) {
        presentDeadlineAnswer(topic);
      } else {
        addMessage('bot', "Je n'ai pas reconnu cette catégorie. Merci d'utiliser les boutons proposés pour sélectionner le type d'échéance.");
      }
      return;
    }
    return;
  }

  const topic = matchDeadlineTopic(trimmed);
  if (topic) {
    presentDeadlineAnswer(topic);
    return;
  }

  if (isDeadlineMenuRequest(trimmed)) {
    showDeadlineMenu();
    return;
  }

  respondWithFaq(trimmed);
};

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;
  userInput.value = '';
  addMessage('user', text);
  processUserMessage(text);
});

// CORRECTION PRINCIPALE : Gestion correcte de tous les boutons d'accès rapide
document.querySelectorAll('.quick-actions .chip').forEach((btn) => {
  btn.addEventListener('click', () => {
    const action = btn.getAttribute('data-action');
    const text = btn.getAttribute('data-text') || btn.textContent.trim();
    
    // Fermer tout menu d'échéances actif avant de traiter
    dismissDeadlineMenu();
    
    // Ajouter le message utilisateur
    addMessage('user', text);
    
    // Si c'est le bouton échéances, afficher le menu
    if (action === 'deadlines') {
      showDeadlineMenu();
      return;
    }
    
    // Sinon, traiter comme un message normal (recherche dans FAQ)
    respondWithFaq(text);
  });
});

// Navbar interactions
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.app-header');

  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        header.style.background = 'linear-gradient(135deg, rgba(255, 122, 0, 0.95) 0%, rgba(15, 157, 88, 0.95) 100%)';
        header.style.backdropFilter = 'blur(20px)';
      } else {
        header.style.background = 'linear-gradient(135deg, var(--orange) 0%, var(--green) 100%)';
        header.style.backdropFilter = 'blur(10px)';
      }
    });
  }

  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', function () {
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });

  const robotIcon = document.querySelector('.robot-icon');
  if (robotIcon) {
    robotIcon.addEventListener('mouseenter', function () {
      this.style.animation = 'pulse 0.6s ease-in-out';
    });
    robotIcon.addEventListener('animationend', function () {
      this.style.animation = '';
    });
  }
});

function startChat() {
  chatbotIcon.style.display = 'none';
  floatingChatContainer.style.display = 'flex';
  addMessage('bot', "Bonjour ! Je suis l'assistant virtuel de la DGI. Comment puis-je vous aider aujourd'hui ?");
  userInput.focus();
}

function closeChat() {
  floatingChatContainer.style.display = 'none';
  chatbotIcon.style.display = 'flex';
  chatWindow.innerHTML = '';
  dismissDeadlineMenu();
}

chatbotIcon.addEventListener('click', startChat);
closeChatBtn.addEventListener('click', closeChat);
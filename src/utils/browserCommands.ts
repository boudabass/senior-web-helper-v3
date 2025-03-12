
// Types de commandes supportées
export type CommandType = 
  | 'OPEN_URL'
  | 'SEARCH'
  | 'CLICK'
  | 'FILL_FORM'
  | 'GO_BACK'
  | 'GO_FORWARD'
  | 'HOME'
  | 'READ_PAGE'
  | 'SCROLL_UP'
  | 'SCROLL_DOWN'
  | 'UNKNOWN';

export interface Command {
  type: CommandType;
  payload?: string | Record<string, string>;
}

// URLs prédéfinies pour les raccourcis
export const predefinedSites: Record<string, string> = {
  'google': 'https://www.google.com',
  'gmail': 'https://www.gmail.com',
  'youtube': 'https://www.youtube.com',
  'facebook': 'https://www.facebook.com',
  'ameli': 'https://www.ameli.fr',
  'impots': 'https://www.impots.gouv.fr',
  'sncf': 'https://www.sncf-connect.com',
  'doctolib': 'https://www.doctolib.fr',
  'mairie': 'https://www.paris.fr', // Par défaut Paris
  'météo': 'https://meteofrance.com',
  'le monde': 'https://www.lemonde.fr',
  'le figaro': 'https://www.lefigaro.fr',
  'wikipedia': 'https://fr.wikipedia.org',
};

// Analyser le texte de commande vocale pour déterminer l'action à effectuer
export const parseVoiceCommand = (text: string): Command => {
  const normalizedText = text.toLowerCase().trim();
  
  // Commande d'ouverture d'un site
  if (normalizedText.includes('ouvre') || normalizedText.includes('va sur') || normalizedText.includes('va à') || normalizedText.includes('ouvrir')) {
    for (const [siteName, url] of Object.entries(predefinedSites)) {
      if (normalizedText.includes(siteName)) {
        return { type: 'OPEN_URL', payload: url };
      }
    }
    
    // Si le site n'est pas reconnu dans notre liste prédéfinie
    const urlMatch = normalizedText.match(/(?:ouvre|va sur|va à|ouvrir)\s+(?:le site|la page)?\s*([\w.-]+\.\w+)/i);
    if (urlMatch && urlMatch[1]) {
      let url = urlMatch[1];
      if (!url.startsWith('http')) {
        url = 'https://' + url;
      }
      return { type: 'OPEN_URL', payload: url };
    }
  }
  
  // Commande de recherche
  if (normalizedText.includes('cherche') || normalizedText.includes('recherche') || normalizedText.includes('rechercher')) {
    const searchQuery = normalizedText
      .replace(/cherche/i, '')
      .replace(/recherche/i, '')
      .replace(/rechercher/i, '')
      .trim();
    
    if (searchQuery) {
      return { type: 'SEARCH', payload: searchQuery };
    }
  }
  
  // Commande de clic
  if (normalizedText.includes('clique') || normalizedText.includes('appuie sur')) {
    let elementName = normalizedText
      .replace(/clique sur/i, '')
      .replace(/appuie sur/i, '')
      .replace(/le bouton/i, '')
      .replace(/le lien/i, '')
      .trim();
    
    return { type: 'CLICK', payload: elementName };
  }
  
  // Commande pour remplir un formulaire
  if (normalizedText.includes('remplis') || normalizedText.includes('écris')) {
    // Cette partie nécessitera une analyse plus fine en fonction des cas d'utilisation
    // Pour l'instant une implémentation simple
    if (normalizedText.includes('nom')) {
      return { 
        type: 'FILL_FORM', 
        payload: { fieldType: 'nom', value: 'Dupont' } // Valeur par défaut pour l'exemple
      };
    }
    if (normalizedText.includes('prénom')) {
      return { 
        type: 'FILL_FORM', 
        payload: { fieldType: 'prénom', value: 'Jean' } // Valeur par défaut pour l'exemple
      };
    }
    if (normalizedText.includes('email')) {
      return { 
        type: 'FILL_FORM', 
        payload: { fieldType: 'email', value: 'jean.dupont@example.com' } // Valeur par défaut pour l'exemple
      };
    }
  }
  
  // Navigation
  if (normalizedText.includes('retour') || normalizedText.includes('précédent')) {
    return { type: 'GO_BACK' };
  }
  
  if (normalizedText.includes('suivant') || normalizedText.includes('avance')) {
    return { type: 'GO_FORWARD' };
  }
  
  if (normalizedText.includes('accueil') || normalizedText.includes('page principale')) {
    return { type: 'HOME' };
  }
  
  // Commandes de défilement
  if (normalizedText.includes('défiler vers le bas') || normalizedText.includes('descendre')) {
    return { type: 'SCROLL_DOWN' };
  }
  
  if (normalizedText.includes('défiler vers le haut') || normalizedText.includes('monter')) {
    return { type: 'SCROLL_UP' };
  }
  
  // Lecture de page
  if (normalizedText.includes('lis') || normalizedText.includes('lecture') || normalizedText.includes('lire')) {
    return { type: 'READ_PAGE' };
  }
  
  // Commande non reconnue
  return { type: 'UNKNOWN' };
};

// Fonction pour extraire le texte pertinent d'une page web
export const extractPageContent = (iframeElement: HTMLIFrameElement | null): string => {
  if (!iframeElement || !iframeElement.contentDocument) {
    return "Impossible d'accéder au contenu de la page.";
  }
  
  const doc = iframeElement.contentDocument;
  
  // Construire un texte à partir des éléments principaux de la page
  let content = '';
  
  // Titre de la page
  const title = doc.title;
  content += `Titre de la page : ${title}.\n`;
  
  // Contenu principal
  // Rechercher les sections principales comme article, main, etc.
  const mainContent = doc.querySelector('main, article, .content, #content, .main, #main');
  
  if (mainContent) {
    // Extraire les paragraphes importants
    const paragraphs = mainContent.querySelectorAll('p, h1, h2, h3, h4, h5, h6');
    
    paragraphs.forEach(p => {
      const text = p.textContent?.trim();
      if (text && text.length > 20) { // Ignorer les petits fragments
        content += text + '.\n';
      }
    });
  } else {
    // Si aucune section principale n'est trouvée, récupérer tous les paragraphes importants
    const paragraphs = doc.querySelectorAll('p');
    let counter = 0;
    
    for (let i = 0; i < paragraphs.length && counter < 5; i++) {
      const text = paragraphs[i].textContent?.trim();
      if (text && text.length > 30) { // Seulement les paragraphes substantiels
        content += text + '.\n';
        counter++;
      }
    }
  }
  
  // Si on n'a pas assez de contenu, essayer d'extraire d'autres éléments
  if (content.length < 100) {
    const allElements = doc.querySelectorAll('div, section');
    let counter = 0;
    
    for (let i = 0; i < allElements.length && counter < 3; i++) {
      const text = allElements[i].textContent?.trim();
      if (text && text.length > 50 && !content.includes(text)) {
        content += text + '.\n';
        counter++;
      }
    }
  }
  
  // Limiter la longueur pour la synthèse vocale
  if (content.length > 1000) {
    content = content.substring(0, 1000) + "... La suite du contenu est trop longue pour être lue.";
  }
  
  return content || "Aucun contenu textuel significatif n'a été trouvé sur cette page.";
};

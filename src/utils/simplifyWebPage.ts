
/**
 * Utilitaire pour simplifier les pages web et les rendre plus accessibles
 */

// Style CSS à injecter dans les pages pour améliorer l'accessibilité
export const generateAccessibilityCSS = (textSize: number = 1.2, highContrast: boolean = false) => {
  return `
    :root {
      --senior-text-size: ${textSize};
      --senior-line-height: 1.6;
      --senior-text-color: ${highContrast ? '#000000' : '#333333'};
      --senior-bg-color: ${highContrast ? '#FFFFFF' : '#F8F9FA'};
      --senior-link-color: ${highContrast ? '#0000EE' : '#0066CC'};
      --senior-visited-color: ${highContrast ? '#551A8B' : '#6F42C1'};
    }
    
    body {
      font-size: calc(1rem * var(--senior-text-size)) !important;
      line-height: var(--senior-line-height) !important;
      color: var(--senior-text-color) !important;
      background-color: var(--senior-bg-color) !important;
      max-width: 1200px !important;
      margin: 0 auto !important;
      padding: 0 20px !important;
    }
    
    p, h1, h2, h3, h4, h5, h6, span, div, li, td, th, label, button, a {
      font-size: inherit !important;
      line-height: inherit !important;
      max-width: 650px !important;
    }
    
    h1 {
      font-size: calc(1.6rem * var(--senior-text-size)) !important;
      margin-top: 1.5em !important;
      margin-bottom: 0.8em !important;
    }
    
    h2 {
      font-size: calc(1.4rem * var(--senior-text-size)) !important;
      margin-top: 1.2em !important;
      margin-bottom: 0.6em !important;
    }
    
    h3 {
      font-size: calc(1.2rem * var(--senior-text-size)) !important;
      margin-top: 1em !important;
      margin-bottom: 0.5em !important;
    }
    
    p {
      margin-bottom: 1em !important;
    }
    
    a {
      color: var(--senior-link-color) !important;
      text-decoration: underline !important;
      font-weight: bold !important;
    }
    
    a:visited {
      color: var(--senior-visited-color) !important;
    }
    
    button, input[type="button"], input[type="submit"] {
      padding: 12px 20px !important;
      font-size: calc(1rem * var(--senior-text-size)) !important;
      border-radius: 8px !important;
      cursor: pointer !important;
      min-height: 44px !important;
      min-width: 44px !important;
    }
    
    input, select, textarea {
      font-size: calc(1rem * var(--senior-text-size)) !important;
      padding: 10px !important;
      border: 2px solid #666 !important;
      border-radius: 6px !important;
      min-height: 44px !important;
    }
    
    img {
      max-width: 100% !important;
      height: auto !important;
    }
    
    /* Masquer les éléments distrayants */
    ins, iframe[src*="ads"], div[id*="google_ads"], div[id*="banner"], div[class*="banner"],
    div[class*="ads"], div[class*="ad-"], div[id*="ad-"], div[class*="popup"], div[id*="popup"] {
      display: none !important;
    }
    
    /* Améliorer la lisibilité globale */
    * {
      box-sizing: border-box !important;
    }
    
    /* Simplifier la mise en page */
    body > * {
      float: none !important;
      position: static !important;
      display: block !important;
      width: 100% !important;
    }
    
    /* Améliorer l'espacement */
    div, section, article, main, aside, nav {
      margin-bottom: 1.5em !important;
    }
    
    /* Texte mieux contrasté */
    * {
      text-shadow: none !important;
    }
  `;
};

// Fonction pour simplifier une page web dans un iframe
export const simplifyWebPage = (
  iframe: HTMLIFrameElement | null, 
  textSize: number = 1.2,
  highContrast: boolean = false
): boolean => {
  if (!iframe || !iframe.contentDocument || !iframe.contentWindow) {
    console.error("Impossible d'accéder au contenu de l'iframe");
    return false;
  }
  
  try {
    // Créer l'élément style
    const styleElement = document.createElement('style');
    styleElement.id = 'senior-accessibility-styles';
    styleElement.textContent = generateAccessibilityCSS(textSize, highContrast);
    
    // Supprimer l'ancien style s'il existe
    const oldStyle = iframe.contentDocument.getElementById('senior-accessibility-styles');
    if (oldStyle) {
      oldStyle.remove();
    }
    
    // Ajouter le style au head du document
    iframe.contentDocument.head.appendChild(styleElement);
    
    // Supprimer certains éléments souvent distrayants
    const elementsToRemove = [
      'iframe:not([title])',
      'div[class*="ads"]',
      'div[id*="ads"]',
      'div[class*="banner"]',
      'div[id*="banner"]',
      'ins',
      'aside'
    ];
    
    elementsToRemove.forEach(selector => {
      iframe.contentDocument?.querySelectorAll(selector).forEach(el => {
        el.remove();
      });
    });
    
    console.log('Page web simplifiée avec succès');
    return true;
  } catch (e) {
    console.error('Erreur lors de la simplification de la page web:', e);
    return false;
  }
};

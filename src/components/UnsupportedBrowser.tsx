
import React from 'react';

const UnsupportedBrowser: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full p-6 bg-card rounded-lg shadow-lg border border-border">
        <h1 className="text-2xl font-bold text-center mb-4">Senior 3000</h1>
        <div className="p-4 bg-destructive/10 rounded-lg mb-6">
          <p className="text-destructive font-medium mb-2">
            Votre navigateur ne prend pas en charge les fonctionnalités vocales requises.
          </p>
          <p className="text-sm">
            Pour utiliser Senior 3000, veuillez ouvrir cette application dans un navigateur plus récent comme Chrome, Edge ou Safari.
          </p>
        </div>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>Chrome (recommandé)</li>
          <li>Microsoft Edge</li>
          <li>Safari (version récente)</li>
        </ul>
        <p className="text-sm text-muted-foreground">
          Senior 3000 utilise les API Web Speech pour la reconnaissance vocale et la synthèse vocale, qui ne sont pas disponibles sur tous les navigateurs.
        </p>
      </div>
    </div>
  );
};

export default UnsupportedBrowser;

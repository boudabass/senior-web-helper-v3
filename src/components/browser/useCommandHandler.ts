
import { useEffect } from 'react';
import { Command } from '@/utils/browserCommands';

export const useCommandHandler = (
  command: Command | null,
  actions: {
    navigateTo: (url: string) => void;
    goBack: () => void;
    goForward: () => void;
    readPageContent: () => void;
    simulateClick: (elementName: string) => void;
    fillForm: (fieldType: string, value: string) => void;
    scrollPage: (direction: 'up' | 'down') => void;
    addToFavorites: (name: string) => void;
    openFavorite: (name: string) => void;
    listFavorites: () => void;
    removeFavoriteByName: (name: string) => void;
    simplifyPage: () => void;
  }
) => {
  useEffect(() => {
    if (!command) return;

    switch (command.type) {
      case 'OPEN_URL':
        if (typeof command.payload === 'string') {
          actions.navigateTo(command.payload);
        }
        break;
      case 'SEARCH':
        if (typeof command.payload === 'string') {
          const searchQuery = encodeURIComponent(command.payload);
          actions.navigateTo(`https://www.google.com/search?q=${searchQuery}`);
        }
        break;
      case 'GO_BACK':
        actions.goBack();
        break;
      case 'GO_FORWARD':
        actions.goForward();
        break;
      case 'HOME':
        actions.navigateTo('https://www.google.com');
        break;
      case 'READ_PAGE':
        actions.readPageContent();
        break;
      case 'CLICK':
        if (typeof command.payload === 'string') {
          actions.simulateClick(command.payload);
        }
        break;
      case 'FILL_FORM':
        if (command.payload && typeof command.payload === 'object') {
          const { fieldType, value } = command.payload as { fieldType: string, value: string };
          actions.fillForm(fieldType, value);
        }
        break;
      case 'SCROLL_DOWN':
        actions.scrollPage('down');
        break;
      case 'SCROLL_UP':
        actions.scrollPage('up');
        break;
      case 'ADD_FAVORITE':
        if (typeof command.payload === 'string') {
          actions.addToFavorites(command.payload);
        }
        break;
      case 'OPEN_FAVORITE':
        if (typeof command.payload === 'string') {
          actions.openFavorite(command.payload);
        }
        break;
      case 'LIST_FAVORITES':
        actions.listFavorites();
        break;
      case 'REMOVE_FAVORITE':
        if (typeof command.payload === 'string') {
          actions.removeFavoriteByName(command.payload);
        }
        break;
      case 'SIMPLIFY_PAGE':
        actions.simplifyPage();
        break;
    }
  }, [command, actions]);
};

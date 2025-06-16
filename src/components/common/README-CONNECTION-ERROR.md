// This file provides information about implementing this component
/*
Composant ConnectionError et BackendError

Ce sont des composants réutilisables pour afficher des erreurs de connexion et de serveur.
Ils doivent être utilisés dans toutes les pages qui font des appels API.

Comment les utiliser:

1. Importer les composants et les utilitaires
```tsx
import { ConnectionError, BackendError } from '../../components/common/ConnectionError';
import { isNetworkError, isServerError } from '../../utils/errorUtils';
```

2. Ajouter un état d'erreur dans le composant
```tsx
const [error, setError] = useState<Error | null>(null);
```

3. Capturer les erreurs lors des appels API
```tsx
try {
  // Appel API
} catch (error) {
  console.error('Erreur:', error);
  showToast('error', 'Message d\'erreur');
  setError(error as Error);
}
```

4. Utiliser les composants dans le rendu
```tsx
{error && isNetworkError(error) ? (
  <ConnectionError 
    message="Message personnalisé pour l'erreur réseau"
    retry={fonctionDeNouvelleTentative}
  />
) : error && isServerError(error) ? (
  <BackendError
    message="Message personnalisé pour l'erreur serveur"
    retry={fonctionDeNouvelleTentative}
  />
) : (
  // Contenu normal de la page
)}
```

Best practices:
- Toujours fournir une fonction de nouvelle tentative
- Utiliser i18n pour les messages d'erreur
- Combiner avec les toasts pour une meilleure expérience utilisateur
- Ne pas afficher les données mockées en cas d'erreur, mais plutôt un message explicite

*/

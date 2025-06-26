# Tests unitaires

Ce dossier contient les tests unitaires pour le backend (Node.js) et le frontend (Vue 3).

## Backend
- Couvre les services critiques (ex : bookingService)
- Cas testés :
  - Cas passant (fonctionnement standard)
  - Cas non passant (erreur métier, droits, etc.)
  - Cas limite (valeurs extrêmes)
- Utilisation de mocks pour isoler les dépendances (repositories, services externes)

## Frontend
- Couvre les composants et stores critiques (ex : LoginView, DashboardView, authStore)
- Cas testés :
  - Cas passant (affichage, interaction normale)
  - Cas non passant (formulaire incomplet, erreur API)
  - Cas limite (champs vides, saisie longue)
- Utilisation de Vue Test Utils et de mocks pour simuler les API

## Limitations
- Les tests frontend nécessitent Vitest (voir README racine ou frontend)
- Les tests backend utilisent Jest

## Structure
- Un fichier par fonctionnalité critique
- Jeux de données de test intégrés dans chaque fichier

## Exécution des tests frontend

Pour exécuter tous les tests unitaires frontend (Vue 3) :

```sh
npx vitest run tests/unit
# ou
npm run test:frontend
```

Cela garantit que seuls les tests frontend sont exécutés (hors backend/services).

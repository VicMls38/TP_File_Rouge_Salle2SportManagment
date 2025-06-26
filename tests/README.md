# Stratégie de test pour Gym Management System

## 1. Introduction

L’application **Gym Management System** est une solution fullstack visant à gérer une salle de sport avec des fonctionnalités utilisateur (réservation, abonnement, facturation) et administrateur (gestion des utilisateurs, classes, abonnements).

Les enjeux fonctionnels majeurs concernent la gestion fiable des réservations, la facturation précise avec pénalités, ainsi que la gestion des abonnements avec différents niveaux.

L’objectif de cette stratégie est de poser une vision claire et structurée des tests à mener, pour garantir la robustesse, la qualité fonctionnelle, et la sécurité du système dans son ensemble.

## 2. Identification des fonctionnalités critiques

| Fonctionnalité           | Criticité | Justification                              |
|-------------------------|-----------|--------------------------------------------|
| Réservation de cours    | Forte     | Cœur métier, impact direct sur l'expérience utilisateur |
| Gestion des abonnements | Forte     | Impact financier et commercial              |
| Facturation et pénalités| Forte     | Gestion monétaire, risque d’erreurs coûteuses |
| Annulation & politique délai | Forte | Respect des règles, prévention des abus    |
| Gestion des utilisateurs| Moyenne   | Important mais moins critique qu’abonnements/réservations |
| Dashboard admin & stats | Moyenne   | Visualisation, moins impact fonctionnel direct |
| CRUD classes            | Faible    | Fonctionnalité support                      |

## 3. Couverture par typologie de test

### Tests unitaires (TU)

- **Fonctionnalités** : Validation des fonctions métier critiques (réservation, validation horaires, calcul facturation, pénalités).
- **Pourquoi** : Permettent d’isoler chaque composant et garantir leur comportement attendu.
- **Outils** : Jest (backend), Vitest (frontend).
- **Exclusion** : Interfaces graphiques complexes et intégrations réseau.

### Tests d’intégration (TI)

- **Fonctionnalités** : Interaction entre services backend, base de données (Prisma/PostgreSQL), API REST.
- **Pourquoi** : Vérifier la cohérence des échanges et intégration des modules.
- **Outils** : Jest avec supertest, tests base de données en mémoire ou sandbox.
- **Exclusion** : UI frontend.

### Tests end-to-end (E2E)

- **Fonctionnalités** : Parcours utilisateur complet, du login à la réservation, annulation, facturation.
- **Pourquoi** : Validation fonctionnelle globale, expérience utilisateur.
- **Outils** : Cypress ou Playwright.
- **Exclusion** : Tests unitaires backend précis.

### Tests de charge

- **Fonctionnalités** : Tests sur les API critiques (réservation, facturation) pour mesurer performances sous charge.
- **Pourquoi** : Garantir la stabilité en conditions réalistes.
- **Outils** : k6, Artillery.
- **Exclusion** : UI, fonctionnalités peu critiques.

### Tests de sécurité

- **Fonctionnalités** : Contrôle d’accès, prévention injections, tests d’authentification/autorisation.
- **Pourquoi** : Protéger les données sensibles et garantir la confidentialité.
- **Outils** : Tests automatisés via OWASP ZAP, scans statiques.
- **Exclusion** : Fonctionnalités métiers non liées à la sécurité.

## 4. Approche par couche (frontend / backend)

| Couche   | Types de tests         | Cibles principales                      |
|----------|-----------------------|---------------------------------------|
| Backend  | TU, TI, Tests sécurité| Business logic, API REST, base de données |
| Frontend | TU, E2E               | Composants Vue, navigation, expérience utilisateur |

- Backend se concentre sur la robustesse métier et intégration avec DB.
- Frontend cible la fluidité UI, interactions et navigation, intégrité des données affichées.

## 5. Planification et priorisation

- **Phase 1** : Tests unitaires backend sur les fonctions critiques (réservation, facturation).
- **Phase 2** : Tests d’intégration backend (API + base).
- **Phase 3** : Tests unitaires frontend sur composants principaux.
- **Phase 4** : Tests E2E sur parcours utilisateur clé.
- **Phase 5** : Tests de charge sur API critiques.
- **Phase 6** : Tests de sécurité automatisés.

**En binôme :**

- Dev1 : Backend + API tests
- Dev2 : Frontend + E2E tests

## 6. Indicateurs de succès

- **Couverture de code :**  
  Backend : ≥ 80% sur le cœur métier (réservations, abonnements)  
  Frontend : ≥ 70% sur composants critiques (réservation, profil)

- **Temps de réponse API :** < 200 ms en charge normale  
- **Stabilité :** 0 régression majeure sur les scénarios critiques après chaque release  
- **Sécurité :** Zéro faille majeure détectée par outils d’analyse

---

## 7. Stratégie de mocking (rendu 2)

### Objectif

Mettre en place des mocks pour isoler les tests unitaires (TU) et d’intégration (TI), afin de garantir la fiabilité et la rapidité des tests tout en assurant la cohérence fonctionnelle.

### Dépendances mockées

- **Base de données (Prisma/PostgreSQL)** : mock des appels CRUD via des repositories mockés pour éviter d’utiliser la base réelle lors des TU.
- **Services externes (ex. : envoi d’emails, paiement)** : mock des appels pour simuler les réponses sans actions réelles.
- **API internes ou modules tiers** : mock pour isoler la couche métier lors des tests.

### Choix techniques

- **Mock complet** (Jest `jest.mock()`) pour remplacer des modules entiers quand on veut simuler totalement leur comportement.
- **Stub/fake** pour remplacer certaines fonctions précises avec des retours contrôlés.
- **Factories** pour générer des données de test réalistes et variées (ex. : utilisateurs, abonnements, réservations).

### Organisation des mocks

- Dossier dédié : `tests/mocks/`
- Fichiers séparés par domaine : `dbMocks.js`, `serviceMocks.js`, `factories.js`
- Helpers pour réinitialiser les mocks et générer des données (ex. `resetMocks()`, `createFakeUser()`)

### Utilisation dans les tests

- TU backend : injection des mocks de repositories/services dans les fonctions métier.
- TI backend : mocks partiels pour certains services, test de l’intégration API + DB en mode sandbox ou base en mémoire.
- TU frontend : mocks des appels API via Vitest/Jest.

### Bénéfices attendus

- Isolation parfaite des composants testés.
- Rapidité d’exécution des tests.
- Possibilité de simuler différents scénarios (succès, erreur, timeout).
- Réduction des effets de bord (pas de dépendance à la DB réelle).

---

## Conclusion

Cette stratégie vise à garantir une couverture complète, en équilibrant qualité, coût et risques métier. Elle sera adaptée au fil du projet selon retours et évolutions fonctionnelles.

# Tests du projet

Ce projet utilise deux outils de test :
- **Jest** pour le backend (Node.js)
- **Vitest** pour le frontend (Vue 3)

## Lancer les tests backend

```sh
npm run test:backend
```

## Lancer les tests frontend

```sh
# Depuis la racine du projet
npx vitest run tests/unit
# Ou depuis le dossier frontend
npm run test:frontend
```

## Structure des tests
- `tests/unit/` : tests unitaires (backend et frontend)
- `tests/integration/` : tests d'intégration

## Justification des choix
- **Jest** : adapté à Node.js, facile à mocker, rapide pour les services métiers
- **Vitest** : compatible Vite/Vue 3, supporte les SFC, rapide pour les composants

## Limitations
- Les tests frontend ne sont pas compatibles avec Jest 30+ (utiliser Vitest)
- Les tests d'intégration nécessitent parfois une base de données ou un serveur mock

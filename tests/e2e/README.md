# Tests E2E Frontend (Playwright)

Ce dossier contient les tests end-to-end (E2E) automatisés pour les parcours critiques du frontend de l’application de gestion de salle de sport.

## Outil utilisé
- **Playwright** (recommandé pour Vue 3, rapide et robuste)

## Préparation de l’environnement
- Les tests utilisent des **fixtures**/données seedées pour garantir la stabilité des scénarios.
- Les utilisateurs de test (membre, admin) sont créés via le script `seed.js` avant chaque run.
- Les tests partent du principe que le backend est lancé en mode test et la base remise à zéro avant chaque suite.

### Lancer le seed avant les tests :
```powershell
node tests/e2e/seed.js
```

## Parcours utilisateur couverts

### 1. Connexion d’un utilisateur et affichage du dashboard
- Cas passant : login valide, dashboard affiché avec infos utilisateur.
- Cas non passant : mauvais mot de passe/email, message d’erreur affiché.
- Cas limite : email très long, champs vides.

### 2. Réservation d’un cours et vérification dans l’historique
- Cas passant : réservation d’un cours, présence dans l’historique.
- Cas non passant : réservation sur cours complet, message d’erreur.
- Cas limite : réservation sur le dernier créneau disponible.

### 3. Annulation d’un cours et gestion de la politique d’annulation
- Cas passant : annulation dans les temps, pas de pénalité.
- Cas non passant : annulation tardive, pénalité affichée.
- Cas limite : annulation d’un cours déjà passé.

### 4. Affichage des informations d’abonnement
- Cas passant : abonnement actif affiché.
- Cas non passant : pas d’abonnement, message d’alerte.
- Cas limite : abonnement expirant aujourd’hui.

### 5. Accès admin : création de cours
- Cas passant : admin crée un cours, confirmation affichée.
- Cas non passant : utilisateur non admin, accès refusé.
- Cas limite : création de cours avec valeurs extrêmes (titre très long, capacité max).

## Hypothèses techniques
- Utilisateur test : `user1@mail.com` (membre), `admin@mail.com` (admin)
- Mot de passe : `password`
- Les sessions sont gérées par cookie (Playwright gère l’auth via context.storageState)
- Les données critiques sont seedées avant chaque test via le script fourni

## Structure
- Un fichier par parcours critique :
  - `login.e2e.spec.ts`
  - `booking.e2e.spec.ts`
  - `cancel.e2e.spec.ts`
  - `subscription.e2e.spec.ts`
  - `admin.e2e.spec.ts`
- Les fixtures sont dans `tests/e2e/fixtures/`

---

**Pour lancer les tests :**

```powershell
node tests/e2e/seed.js
npx playwright test tests/e2e
```

Ou via le script npm si défini :

```powershell
npm run test:e2e
```

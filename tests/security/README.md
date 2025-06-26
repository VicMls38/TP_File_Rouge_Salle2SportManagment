# Tests de sécurité – Synthèse

## 1. Scan des dépendances

- **Outil utilisé** : `npm audit` (intégré à npm)
- **Commande** :
  ```
  npm audit --audit-level=moderate
  ```
- **Résultats** :
  - Liste des vulnérabilités trouvées (voir rapport `npm-audit.json` si exporté)
  - Analyse : la plupart des vulnérabilités sont issues de dépendances transitoires. Certaines peuvent être corrigées par `npm audit fix`, d'autres nécessitent une mise à jour manuelle ou sont des faux positifs (ex : packages de dev non exposés en prod).

## 2. Linter de sécurité JS

- **Outil utilisé** : `eslint-plugin-security`
- **Installation** :
  ```
  npm install --save-dev eslint-plugin-security
  ```
- **Configuration** :
  Ajouté dans `.eslintrc` :
  ```json
  {
    "plugins": ["security"],
    "extends": ["plugin:security/recommended"]
  }
  ```
- **Résultats** :
  - Les alertes concernent surtout l’usage de fonctions potentiellement dangereuses (`eval`, `new Function`, etc.)
  - Analyse : la plupart des alertes sont des bonnes pratiques, peu de vrais risques si le code suit les standards Node.js/Vue.

## 3. Scan d’endpoint avec OWASP ZAP

- **Outil utilisé** : OWASP ZAP (mode rapide)
- **Cible** : `http://localhost:3000/api/classes`
- **Résultats** :
  - Quelques alertes sur les headers HTTP (sécurité, CORS, cookies non sécurisés)
  - Pas de faille critique détectée (XSS, SQLi, etc.) sur les endpoints testés
  - Analyse : certains avertissements sont des faux positifs ou des recommandations génériques (headers, cookies). À corriger pour durcir la surface d’attaque.

## 4. Retour critique

- **Pertinence** :
  - `npm audit` et ZAP détectent surtout des problèmes de configuration ou de dépendances, peu de failles directes dans le code métier.
  - Les faux positifs sont fréquents (devDependencies, headers génériques).
- **Correctifs proposés** :
  - Mettre à jour les dépendances critiques
  - Ajouter les headers de sécurité recommandés (CSP, X-Frame-Options, etc.)
  - Appliquer les recommandations ESLint sur le code sensible

---

Pour plus de détails, voir les rapports bruts (`npm-audit.json`, rapport ZAP HTML/MD) dans ce dossier si générés.

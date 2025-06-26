# Tests de montée en charge (Load/Stress/Soak/Spike)

Ce dossier contient la stratégie, les scripts et l'analyse des tests de charge réalisés sur le backend.

## Outils utilisés
- **K6** : pour les tests de charge classiques (load, stress, soak)
- **JMeter** : pour le spike test

## Stratégie & Scénarios

### 1. Réservation simultanée de cours (K6)
- **Objectif** : Simuler 100 utilisateurs qui réservent un cours en même temps.
- **Type** : Load test
- **Métriques** : latence, taux d'erreur, RPS

### 2. Consultation en masse du planning (K6)
- **Objectif** : Simuler 200 utilisateurs qui consultent le planning des cours.
- **Type** : Soak test (10 min)
- **Métriques** : stabilité, mémoire, latence

### 3. Création de comptes utilisateurs (K6)
- **Objectif** : Simuler la création de 50 comptes en boucle.
- **Type** : Stress test
- **Métriques** : seuil de saturation, erreurs 5xx

### 4. Annulations massives de dernière minute (K6)
- **Objectif** : Simuler 50 annulations simultanées.
- **Type** : Load test
- **Métriques** : latence, cohérence des données

### 5. Spike test (JMeter)
- **Objectif** : Simuler un pic brutal de 500 requêtes/s puis une chute rapide.
- **Type** : Spike test
- **Métriques** : latence, erreurs, récupération

## Analyse des résultats
- Les résultats K6 sont exportés en JSON/HTML et inclus dans ce dossier.
- Les métriques clés (latence, erreurs, RPS) sont commentées pour chaque scénario.
- Les seuils acceptables sont définis dans chaque script.

## Lancer les tests
- K6 : `k6 run <script.js>`
- JMeter : ouvrir le fichier `.jmx` dans l'interface graphique et lancer le test.

---

Pour chaque script, voir les commentaires en tête de fichier pour le détail du scénario et des endpoints visés.

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





PS C:\Users\victo\OneDrive\Bureau\Travail\Cours_MBA\MBA2\Salle2SportManagement> k6 run tests/load/classes_get_load.js

         /\      Grafana   /‾‾/  
    /\  /  \     |\  __   /  /   
   /  \/    \    | |/ /  /   ‾‾\ 
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/ 

     execution: local
        script: tests/load/classes_get_load.js
        output: -

     scenarios: (100.00%) 1 scenario, 50 max VUs, 1m30s max duration (incl. graceful stop):
              * default: 50 looping VUs for 1m0s (gracefulStop: 30s)



  █ THRESHOLDS

    http_req_duration
    ✓ 'p(95)<800' p(95)=28.54ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%


  █ TOTAL RESULTS

    checks_total.......................: 2977    48.809664/s
    checks_succeeded...................: 100.00% 2977 out of 2977
    checks_failed......................: 0.00%   0 out of 2977

    ✓ status 200

    HTTP
    http_req_duration.......................................................: avg=15.74ms min=3.55ms med=10.45ms max=280.43ms p(90)=21.44ms p(95)=28.54ms
      { expected_response:true }............................................: avg=15.74ms min=3.55ms med=10.45ms max=280.43ms p(90)=21.44ms p(95)=28.54ms
    http_req_failed.........................................................: 0.00%
  0 out of 2977
    http_reqs...............................................................: 2977 
  48.809664/s

    EXECUTION
    iteration_duration......................................................: avg=1.01s   min=1s     med=1.01s   max=1.28s    p(90)=1.02s   p(95)=1.02s
    iterations..............................................................: 2977 
  48.809664/s
    vus.....................................................................: 2    
  min=2         max=50
    vus_max.................................................................: 50   
  min=50        max=50

    NETWORK
    data_received...........................................................: 15 MB
  249 kB/s
    data_sent...............................................................: 241 kB 4.0 kB/s



                                                                                   
running (1m01.0s), 00/50 VUs, 2977 complete and 0 interrupted iterations           
default ✓ [======================================] 50 VUs  1m0s   
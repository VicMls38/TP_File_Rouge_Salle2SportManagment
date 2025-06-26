# Tests d'intégration

Ce dossier contient les tests d'intégration pour le backend et le frontend.

## Backend
- Vérifie l'intégration entre les routes, contrôleurs et services (ex : endpoints Express)
- Peut utiliser une base de données de test ou des mocks avancés
- Cas testés :
  - Flux complet (réservation, annulation, etc.)
  - Gestion des erreurs sur plusieurs couches

## Frontend
- Vérifie l'intégration entre composants, stores et services
- Peut simuler des appels API réels ou mockés

## Limitations
- Les tests d'intégration sont plus lents et nécessitent parfois une configuration spécifique (ex : base de données, serveur mock)

## Structure
- Un fichier par flux critique
- Jeux de données de test intégrés dans chaque fichier

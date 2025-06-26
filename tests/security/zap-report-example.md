# Exemple de rapport OWASP ZAP

## Cible : http://localhost:3000/api/classes

### Résumé
- **Alerte** : Absence de certains headers de sécurité (CSP, X-Frame-Options)
- **Alerte** : Cookie non sécurisé (pas de flag HttpOnly/Secure)
- **Alerte** : CORS permissif
- **Alerte** : Informations sur le serveur dans les headers
- **Alerte** : Absence de protection X-Content-Type-Options

### Détail
- **Aucune faille critique détectée** (pas de XSS, pas de SQLi sur les endpoints testés)
- **Recommandations** :
  - Ajouter les headers de sécurité recommandés
  - Configurer les cookies avec les flags `HttpOnly` et `Secure`
  - Restreindre les origines CORS si possible

### Interprétation
- La plupart des alertes sont des recommandations génériques ou des faux positifs.
- Aucun endpoint critique n’a été compromis lors du scan automatique.

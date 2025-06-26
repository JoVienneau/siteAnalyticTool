https://chatgpt.com/share/685c569b-e124-8002-8f49-e6c008096200

# Note de Développement – Outil d'Analytics Web Personnalisé

## Objectif du Projet

Développer un système complet et auto-hébergé de suivi du comportement utilisateur pour mon site portfolio WordPress.  
L'objectif est d'avoir un contrôle total sur les données collectées et de démontrer mes compétences full-stack (Frontend, API design, Backend, Base de données).

---

## Liste des Comportements Utilisateur à Suivre (Tracking Scope)

| Catégorie | Comportement |
|---|---|
| Navigation | Page views (chargement de pages) |
| Engagement | Scroll depth (profondeur de scroll) |
|  | Clics sur les boutons Call-to-Action |
|  | Clics sur les liens de navigation internes |
|  | Clics sur les liens externes |
| Formulaires | Soumissions de formulaires de contact |
| Session | Attribution d’un ID de session unique par visite |
| Trafic entrant | Referrer URL (provenance) |
|  | UTM parameters (si présents dans l’URL) |
| Environnement utilisateur | Type d’appareil (Mobile / Desktop / Tablet) |
|  | Système d’exploitation |
|  | Navigateur et version |
| À développer plus tard | Temps passé sur la page, suivi des erreurs JS, heatmaps |

---

## Phases de Développement

### Première Semaine – Focus Frontend (Tracking côté client)

#### Objectif de la semaine

Créer un script de tracking JavaScript léger, intégré à WordPress, capable de capturer les événements essentiels et de les envoyer vers un point de collecte (backend mock temporaire).

---

### Tâches prévues pour la Semaine 1

| Jour | Tâches |
|---|---|
| Jour 1 | Définition du périmètre des événements à suivre :<br>- Finalisation de la liste des comportements à suivre<br>- Définition des données exactes à envoyer pour chaque événement<br>- Choix de la méthode de gestion de session (localStorage / cookies) |
| Jour 2 | Structuration du projet frontend :<br>- Création de l’environnement de développement (repo, fichiers JS, etc.)<br>- Définition de la structure du script de tracking |
| Jour 3 | Implémentation des premiers détecteurs d’événements :<br>- Page views<br>- Scroll Depth<br>- Clics (boutons, liens) |
| Jour 4 | Mise en place d’un endpoint mock pour tester l’envoi des données :<br>- Backend simple (PHP ou service externe de test type webhook.site)<br>- Tests de POST des payloads JSON |
| Jour 5 | Tests de bout en bout :<br>- Simulation de navigation utilisateur<br>- Vérification des requêtes envoyées<br>- Debug frontend |
| Jour 6 | Finalisation de la structure des payloads :<br>- Uniformisation du format des événements<br>- Documentation du format JSON |
| Jour 7 | Documentation :<br>- Rédaction du README du projet<br>- Bilan de la semaine et préparation pour la suite (backend, base de données) |

---

## Prochaines étapes (Semaines suivantes)

- Création de la base de données MySQL (en utilisant des tables personnalisées dans WordPress)
- Développement de l’API de réception et de stockage des événements
- Mise en place de dashboards d’analyse des données collectées
- Optimisations de performance et de sécurité
- Ajout de fonctionnalités avancées (heatmaps, suivi des erreurs, etc.)

---

## Spécification des Payloads JSON par Événement

### 1. Page View

- **Nom de l’événement (event_type)** :  
`"page_view"`

- **Champs à inclure dans le payload :**
  - `page_url` : URL complète de la page
  - `referrer` : URL de provenance
  - `session_id` : ID de session utilisateur
  - `timestamp` : Date/heure de l’événement
  - `device_type` : Type d’appareil (desktop / mobile / tablet)
  - `browser` : Navigateur
  - `os` : Système d’exploitation
  - `utm_parameters` : Si présents (source, medium, campaign, etc.)

---

### 2. Scroll Depth

- **Nom de l’événement (event_type)** :  
`"scroll_depth"`

- **Champs à inclure :**
  - `page_url`
  - `scroll_percentage` : Pourcentage de scroll atteint (exemple : 25, 50, 75, 100)
  - `session_id`
  - `timestamp`

---

### 3. Click (Call-to-Action, Navigation, Lien Externe)

- **Nom de l’événement (event_type)** :  
`"click"`

- **Champs à inclure :**
  - `element_id` ou `element_text` : Identifiant ou texte du bouton / lien cliqué
  - `element_type` : Type de l’élément (button / link / nav / external)
  - `page_url`
  - `session_id`
  - `timestamp`

---

### 4. Form Submission

- **Nom de l’événement (event_type)** :  
`"form_submission"`

- **Champs à inclure :**
  - `form_id` ou `form_name`
  - `fields_filled` : Liste des noms de champs remplis (sans les valeurs personnelles)
  - `page_url`
  - `session_id`
  - `timestamp`

---

### 5. Session Start (optionnel)

- **Nom de l’événement (event_type)** :  
`"session_start"`

- **Champs à inclure :**
  - `session_id`
  - `start_time`
  - `device_type`
  - `browser`
  - `os`

---

## Champs Globaux (communs à tous les événements)

- `session_id`
- `timestamp`
- `page_url`
- `user_agent`
- `device_type`
- `browser`
- `os`

---

## Prochaines étapes immédiates

- Valider cette spécification
- Implémenter la structure des payloads dans le script de tracking JavaScript
- Configurer un endpoint mock pour les tests de POST

---

## Méthode de Gestion des Sessions

Pour suivre les sessions utilisateur uniques à travers les pages et les interactions, j'utiliserai des **cookies navigateur**.

### Détails techniques :

- **Génération de l'ID de Session :**  
Un UUID (Universally Unique Identifier) sera généré pour chaque nouvelle session.

- **Méthode de stockage :**  
L'ID de session sera stocké dans un **cookie** avec les propriétés suivantes :
  - **Nom :** `custom_analytics_session_id`
  - **Expiration :**  
    Le cookie expirera **30 minutes après la dernière interaction de l'utilisateur** (expiration glissante qui se renouvelle à chaque événement). Cela suit la pratique standard des outils d'analytics (ex : Google Analytics).

- **Logique de Timeout de Session :**  
Si aucune activité n’est détectée pendant 30 minutes, un nouvel ID de session sera généré lors de la prochaine interaction ou du prochain chargement de page.

- **Considérations de confidentialité :**  
Étant donné qu'il s'agit d'un cookie **first-party** et qu’il ne contient **aucune donnée personnelle**, il reste conforme aux standards de base en matière de vie privée.  
Cependant, un mécanisme de consentement pourra être ajouté plus tard pour la conformité RGPD.

### Exemple de fonctionnement :

1. Lors du premier chargement de page :  
→ Vérification de l’existence du cookie  
→ Si absent, génération d’un nouvel UUID  
→ Création du cookie avec expiration à 30 minutes  

2. À chaque interaction utilisateur (page view, scroll, clic, etc.) :  
→ Rafraîchissement de l'expiration du cookie pour prolonger la session  

3. Après 30 minutes d'inactivité :  
→ L'événement suivant générera un nouvel ID de session  
→ Démarrage d’un nouveau cycle de session  


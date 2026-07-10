# Flashcards

Outil de révision par flashcards, en une seule page HTML, hébergé sur GitHub Pages, installable comme application (PWA). Pas de build, pas de backend : un lecteur pour réviser et un gestionnaire pour créer/éditer des collections.

## Fonctionnalités

- **Lecteur** : sélection d'une ou plusieurs collections (avec tout sélectionner/désélectionner en un clic), filtrage par tag, deux modes de session :
  - *Aléatoire simple* — les cartes sont mélangées, sans suivi de progression.
  - *Répétition espacée* (SM-2 simplifié) — les cartes notées « à revoir » reviennent vite, celles notées « facile » reviennent plus tard. Le facteur de facilité (EF) et le nombre de révisions sont affichés au dos de chaque carte.
- **Cartes riches** : texte au format Markdown, équations LaTeX (`$...$` inline, `$$...$$` en bloc, rendu via KaTeX), images par chemin relatif (SVG compris). La carte s'ajuste automatiquement à la hauteur de son contenu, sans scroll.
- **Gestionnaire** : création et édition de cartes avec aperçu en direct, export du JSON de la collection, gestion de l'index des collections disponibles.
- **Progression de révision** : stockée dans le `localStorage` du navigateur (propre à chaque appareil), avec export/import JSON pour la sauvegarder ou la transférer entre appareils.
- **Application installable (PWA)** : icône sur l'écran d'accueil (Android/iOS), lancement en plein écran, et fonctionnement hors ligne pour tout contenu déjà consulté (collections et images mises en cache automatiquement).

## Structure du dépôt

```
index.html                ← l'application (lecteur + gestionnaire)
manifest.json              ← manifeste PWA (nom, icônes, couleurs)
service-worker.js          ← cache hors-ligne (app shell, collections, images)
icons/
  icon-192.png
  icon-512.png
  icon-maskable-512.png
collections/
  index.json              ← liste des collections disponibles pour le lecteur
  <id-collection>.json     ← une collection = un fichier
assets/
  <id-collection>/
    image1.svg             ← images référencées par les cartes de cette collection
```

## Format d'une collection

```json
{
  "id": "maths-analyse",
  "name": "Maths — Analyse",
  "cards": [
    {
      "id": "c_001",
      "tags": ["limites"],
      "front": { "text": "Texte Markdown + $LaTeX$", "image": "" },
      "back":  { "text": "$$Réponse$$", "image": "assets/maths-analyse/fig1.png" }
    }
  ]
}
```

Seul un texte ou une image par face est requis ; le reste des champs peut rester vide. Voir `exemple-modele.json` pour un modèle complet (texte simple, LaTeX, image, carte mixte, carte sans image).

## Format de l'index

```json
{
  "collections": [
    { "id": "maths-analyse", "name": "Maths — Analyse", "file": "collections/maths-analyse.json" }
  ]
}
```

## Workflow

1. Ouvrir `index.html` (en local ou via GitHub Pages) → onglet **Gérer**.
2. Créer ou éditer une collection, exporter son JSON.
3. Déposer le fichier dans `collections/`, les images dans `assets/<id>/`.
4. Mettre à jour `collections/index.json` (onglet **Gérer → Index**) pour la rendre disponible dans le lecteur — chargé automatiquement à l'ouverture de la page.
5. Commit + push.

**Note locale** : le chargement automatique de `collections/index.json` via `fetch()` ne fonctionne qu'une fois le site déployé (ou servi via un serveur local), pas en ouvrant le fichier directement (`file://`) à cause des restrictions CORS. En local, utiliser le bouton « Ajouter des fichiers de collection » pour un import manuel.

## Progressive Web App

- **Installation** : sur Android, « Ajouter à l'écran d'accueil » depuis Chrome ; sur iOS, Safari → Partager → « Sur l'écran d'accueil ».
- **Hors ligne** : l'app elle-même (HTML/CSS/JS/polices/librairies) est mise en cache dès la première visite. Les collections et leurs images sont mises en cache dès qu'elles sont ouvertes une fois en ligne, puis restent disponibles hors connexion. Les collections sont revérifiées « réseau d'abord » à chaque ouverture avec connexion, pour rester à jour.
- **Mise à jour de l'app** : la plupart des changements (`index.html`, contenu) se propagent automatiquement en 1-2 ouvertures grâce au rafraîchissement en arrière-plan du cache. Pour forcer une mise à jour immédiate et nette (changement structurel important), incrémenter `APP_VERSION` en haut de `service-worker.js` — cela invalide et reconstruit le cache de l'app shell.
- **Stockage local** : `localStorage` (progression SM-2) est rattaché à l'origine du site. Sur iOS, une PWA installée sur l'écran d'accueil utilise un stockage séparé de Safari (et échappe à la purge automatique après inactivité) ; sur Android, le stockage est partagé avec Chrome. Dans tous les cas, aucune synchronisation entre appareils — utiliser l'export/import de progression pour transférer ou sauvegarder les données.

## Stack

Fichier unique, sans build. Dépendances chargées en CDN : [marked.js](https://github.com/markedjs/marked) (Markdown), [DOMPurify](https://github.com/cure53/DOMPurify) (sanitisation), [KaTeX](https://katex.org/) (équations).

## Conventions

Commits au format [Conventional Commits](https://www.conventionalcommits.org/), messages en français.

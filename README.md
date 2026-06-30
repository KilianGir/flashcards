# Flashcards

Outil de révision par flashcards, en une seule page HTML, hébergé sur GitHub Pages. Pas de build, pas de backend : un lecteur pour réviser et un gestionnaire pour créer/éditer des collections.

## Fonctionnalités

- **Lecteur** : sélection d'une ou plusieurs collections, filtrage par tag, deux modes de session :
  - *Aléatoire simple* — les cartes sont mélangées, sans suivi de progression.
  - *Répétition espacée* (SM-2 simplifié) — les cartes notées « à revoir » reviennent vite, celles notées « facile » reviennent plus tard. La progression est stockée dans le `localStorage` du navigateur (propre à chaque appareil).
- **Cartes riches** : texte au format Markdown, équations LaTeX (`$...$` inline, `$$...$$` en bloc, rendu via KaTeX), images par chemin relatif.
- **Gestionnaire** : création et édition de cartes avec aperçu en direct, export du JSON de la collection, gestion de l'index des collections disponibles.

## Structure du dépôt

```
index.html                ← l'application (lecteur + gestionnaire)
collections/
  index.json              ← liste des collections disponibles pour le lecteur
  <id-collection>.json     ← une collection = un fichier
assets/
  <id-collection>/
    image1.png             ← images référencées par les cartes de cette collection
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
4. Mettre à jour `collections/index.json` (onglet **Gérer → Index**) pour la rendre disponible dans le lecteur.
5. Commit + push.

**Note locale** : le chargement automatique de `collections/index.json` via `fetch()` ne fonctionne qu'une fois le site déployé (ou servi via un serveur local), pas en ouvrant le fichier directement (`file://`) à cause des restrictions CORS. En local, utiliser les boutons d'import manuel de fichiers JSON.

## Stack

Fichier unique, sans build. Dépendances chargées en CDN : [marked.js](https://github.com/markedjs/marked) (Markdown), [DOMPurify](https://github.com/cure53/DOMPurify) (sanitisation), [KaTeX](https://katex.org/) (équations).

## Conventions

Commits au format [Conventional Commits](https://www.conventionalcommits.org/), messages en français.

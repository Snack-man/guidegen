# GuideGen

Application web (React + TypeScript + Vite + Tailwind CSS) permettant de générer des guides PDF personnalisés en 4 étapes : choix du thème, informations, contacts, génération.

## Prérequis

- [Node.js](https://nodejs.org/) version 18 ou supérieure (recommandé : 20+)
- npm (installé automatiquement avec Node.js)

Vérifie ta version avec :

```bash
node -v
npm -v
```

## Installation

Depuis le dossier du projet :

```bash
npm install
```

## Lancer en local (développement)

```bash
npm run dev
```

L'application sera accessible sur **http://localhost:5173**.

## Build de production

```bash
npm run build
```

Les fichiers optimisés sont générés dans le dossier `dist/`.

Pour prévisualiser le build de production en local :

```bash
npm run preview
```

## Mettre le projet sur GitHub

1. Crée un nouveau dépôt vide sur [github.com/new](https://github.com/new) (ne coche ni README, ni .gitignore, ni licence).
2. Depuis le dossier du projet, initialise git et fais ton premier commit :

```bash
git init
git add .
git commit -m "Premier commit — GuideGen"
git branch -M main
```

3. Relie ton dossier local au dépôt GitHub (remplace l'URL par celle de ton dépôt) :

```bash
git remote add origin https://github.com/TON-UTILISATEUR/TON-DEPOT.git
git push -u origin main
```

Ton code est alors en ligne sur GitHub. Pour les prochaines modifications :

```bash
git add .
git commit -m "Description des changements"
git push
```

## Publier en ligne avec GitHub Pages

Ce projet inclut un workflow GitHub Actions (`.github/workflows/deploy.yml`) qui construit et publie automatiquement le site à chaque `push` sur `main`.

1. Sur GitHub, va dans **Settings → Pages** de ton dépôt.
2. Sous "Build and deployment", choisis **Source : GitHub Actions**.
3. Vérifie que le nom du dépôt correspond bien à la ligne `base: '/guidegen/'` dans `vite.config.ts`. Si ton dépôt s'appelle autrement (ex. `mon-projet`), remplace cette ligne par `base: '/mon-projet/'`.
4. Fais un `git push` — l'onglet **Actions** du dépôt te montre la progression du déploiement.
5. Une fois terminé (coche verte), ton site est accessible à `https://TON-UTILISATEUR.github.io/guidegen/`.

⚠️ Ne publie jamais directement les fichiers sources (`src/`, etc.) comme "site" — le navigateur ne peut pas exécuter du TypeScript/React brut. Il faut toujours passer par le build (`npm run build`), ce que le workflow fait automatiquement.

## Structure du projet

```
src/
  App.tsx        Composant principal (wizard 4 étapes + aperçu)
  main.tsx        Point d'entrée React
  index.css       Styles globaux + Tailwind
index.html         Page HTML
vite.config.ts     Configuration Vite
package.json        Dépendances et scripts
```

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

# BasicMS

Bienvenue sur le test technique BasicMS (Node.js).

## Test technique

La liste des tâches à effectuer est ci-dessous.
Technos obligatoire :

- Node.js
- Docker via Docker-compose (démarrage via un simple "docker-compose up")
- Micro-services via API REST
- Git

Technos secondaire et non obligatoire :

- TypeScript
- PostreSQL
- Postman

_PS: Je te conseille de lire tout le document avant, de commencer._

### Écosystème de micro-services

Objectif final, crée 3 MS (Micro-Services) indépendant les uns des autres (packages.json, node_modules, ...), avec une structure similaire (mais aucun fichier en commun, sauf typage TypeScript si nécessaire), dans un seul repos Git avec, idéalement, des commits fréquent :

- **Gateway User**
  MS accessible publiquement (web, app, ...), permettant à un utilisateur de se connecter et de récupérer ses informations.
- **MS Security**
  MS inaccessible au publique, il permet de gérer le système de token.
- **MS User**
  MS inaccessible au publique, permet de gérer les utilisateurs.

_PS: schéma de l'architecture, voir : "schema-microservices.png"_

### MS User

Crée le service User avec 2 routes :

- Une permettant de vérifier une authentification avec l'e-mail et le mot de passe
- Une autre pour récupérer les données d'un utilisateur via une simple ID

Évidement, crée aussi la structure pour la base de données, afin de stocker les utilisateurs (hésite pas à ajouter quelques champs supplémentaires, pour rendre le test plus "sympa", ex: téléphone, nom, ...).

### MS Security

Crée le service Security avec 2 routes :

- Une permettant de créer un token (carte blanche sur la méthode : stockage en BDD, JWT, ...) avec une ID utilisateur
- Une autre permettant d'authentifier un token et d'obtenir l'ID utilisateur correspondant

### Gateway User

Créer la gateway user, avec les routes suivantes :

- Une pour s'authentifier via le service User et obtenir un token via le service Security
- Une autre (un genre de "/me") pour obtenir ces informations (champs utilisateur de la BDD) via un token (checké par le service Security) et en obtenant la data du service User

### Tests

Mettre en place des tests, permettant de vérifier le bon fonctionnement de chaque route de chaque MS (hors Gateway User).

## Note final

L'idée est d'avoir un code structuré, **sécurisé**, logique, facilement compréhensible et modulable.
Mais toujours avec l'optique que le projet reste globalement "simple" et fonctionne instantanément.

Enfin, push ton projet sur un repos Git privée (comme Gitlab, Github, ...) et donne moi un accès en lecture à l'adresse mail avec la quel tu as reçu ces fichiers.

Bon courage 👍

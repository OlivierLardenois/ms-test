# BasicMS

## Installation steps

- Executer `yarn` dans le fichier root
- Ajouter un fichier `.env.prod` dans chaque MS (cf `env.README`)
- Run `docker-compose up`

La gateway est accessible sur le port **8000** avec 2 routes :

- `login`: POST (Exemple body : { email: "olivier@test.com", password: "password" })
- `me`: GET.

## Debug

Pour lancer en debug, ajouter un fichier `.env` dans chaque MS (cf `env.README`).

## Tests

Afin que les MS **user** et **security** soient inaccessibles au publique, leurs ports ne sont pas exposé dans le docker-compose.

Cela implique que les tests doivent être run sur les MS :

- Soit en ayant run les services en debug
- Soit en exposant les ports dans le docker-compose

Puis en executant la commande `yarn tests:integration` dans les dossiers des MS

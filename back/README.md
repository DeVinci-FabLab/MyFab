# ![Wooow quel beau logo](https://www.fablabs.io/media/W1siZiIsIjIwMTcvMTAvMjUvMTMvNDgvMjQvZTQzZDgxMGUtM2ZiMy00MjZjLTlhNzYtOGFlYzg1ZWY1OGNjL0xPR08gREVWSU5DSSBGQUJMQUIucG5nIl0sWyJwIiwidGh1bWIiLCIzMDB4MzAwIl1d/LOGO%20DEVINCI%20FABLAB.png?sha=9ae18eebf0e6ea56)MyFab - Backend

Bonjour ! Vous vous trouvez actuellement sur le respository de MyFab mais côté backend. Le back est basé sur du nodejs en utilisant `express` pour gérer les endpoints et `swagger` pour faire une belle documentation 😁. Ce projet est fait pour fonctionner avec le projet [Front](https://github.com/devincifablab/MyFabUltimate_Front).

### Installation:

1.  Cloner le repo.
2.  node@18.13.0 et npm@9.1.1 sont des prérequis.
3.  Exécuter dans le dossier du répertoire `npm install`.
4.  Créer le fichier `./config.json`, de cette manière:

```
{
    "db": {
        "host": "localhost",
        "user": "root",
        "password": "",
        "database": "myFabUltimate"
    },
    "siteRoot": "http://localhost:3000/",
    "url": "http://localhost:",
    "port": 5000,
    "showSwagger": true,
    "activeLogs": true,
    "specialTocken": "specialTocken",
    "mail": {
        "activateMail": false,
        "user": "yourMail@gmail.com",
        "pass": "yourPassword"
    },
    "adsf": {
        "entryPoint": "http://example.com",
        "issuer": "http://app.example.com"
  }
}
```

6.  Créer la base de données `myFabUltimate`.
7.  Pour importer les tables et les valeurs par défaut exécutez la commande `npm run prepareDb`
8.  Et voilà, c'est prêt ! Il vous suffit d'exécuter ensuite `npm run start` pour lancer le back (la documentation sera visible ici => http://localhost:5000/api-docs/).

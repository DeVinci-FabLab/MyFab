# ![Wooow quel beau logo](https://www.fablabs.io/media/W1siZiIsIjIwMTcvMTAvMjUvMTMvNDgvMjQvZTQzZDgxMGUtM2ZiMy00MjZjLTlhNzYtOGFlYzg1ZWY1OGNjL0xPR08gREVWSU5DSSBGQUJMQUIucG5nIl0sWyJwIiwidGh1bWIiLCIzMDB4MzAwIl1d/LOGO%20DEVINCI%20FABLAB.png?sha=9ae18eebf0e6ea56)MyFab - Backend

Bonjour ! Vous vous trouvez actuellement sur le respository de MyFab mais côté backend. Le back est basé sur du nodejs en utilisant `express` pour gérer les endpoints et `swagger` pour faire une belle documentation 😁. Ce projet est fait pour fonctionner avec le [Front](https://github.com/DeVinci-FabLab/MyFab/tree/main/back).

### Installation:

1.  Cloner le repo.
2.  node@16.19.0 et npm@9.1.1 sont des prérequis.
3.  Exécuter dans le dossier du répertoire `npm install`.
4.  Créer le fichier `.env`, de cette manière à la racine du projet:

```
# GLOBAL
PORT_FRONT=3000
PORT_BACK=5000
API=urlForTheApi
BASE_PATH=/yourPath

# Maria Db
DB_HOST=mariadb
DB_USER=yourUser
DB_ROOT_PASSWORD=yourPasswordRoot
DB_PASSWORD=yourPassword
DB_DATABASE=myfab

# Back
SPECIALTOKEN=yourSpecialToken
SHOWSWAGGER=true
ACTIVELOGS=false

#SAML
ADSF_ENTRYPOINT=http://localhost:8080/simplesaml/saml2/idp/SSOService.php
ADSF_ISSUER=http://app.example.com
ADFS_FRONT_URL=http://localhost:3000/myfab/
```

6.  Créer la base de données `myfab`.
7.  Pour importer les tables et les valeurs par défaut exécutez la commande `npm run prepareDb`
8.  Et voilà, c'est prêt ! Il vous suffit d'exécuter ensuite `npm run start` pour lancer le back (la documentation sera visible ici => http://localhost:5000/api-docs/).

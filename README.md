# ![Wooow quel beau logo](https://www.fablabs.io/media/W1siZiIsIjIwMTcvMTAvMjUvMTMvNDgvMjQvZTQzZDgxMGUtM2ZiMy00MjZjLTlhNzYtOGFlYzg1ZWY1OGNjL0xPR08gREVWSU5DSSBGQUJMQUIucG5nIl0sWyJwIiwidGh1bWIiLCIzMDB4MzAwIl1d/LOGO%20DEVINCI%20FABLAB.png?sha=9ae18eebf0e6ea56)MyFab

Bonjour ! Vous vous trouvez actuellement sur le respository de MyFab. Vous trouvez dans ce dossier les fichiers pour faire fonctionner le service du back-end.

### Installation

1. Cloner le repo
2. Vérifier que docker et docker-compose sont installés
3. Créer le fichier `.env`, de cette manière à la racine du projet:

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
SHOWSWAGGER=false
ACTIVELOGS=false

#SAML
ADSF_ENTRYPOINT=http://localhost:8080/simplesaml/saml2/idp/SSOService.php
ADSF_ISSUER=http://app.example.com
ADFS_FRONT_URL=http://localhost:3000/myfab/
```

4. Lancer la commande `docker-compose up -d`

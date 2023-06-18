<div align="center">
	<br />
	<p>
		<a><img src="back/defaultFiles/logo.png" width="500" alt="MyFab" /></a>
	</p>
	<br />
	<p>
		<a href="https://github.com/discordjs/discord.js/actions"><img src="https://github.com/DeVinci-FabLab/MyFab/actions/workflows/Tests-agent.yml/badge.svg" alt="Agent status" /></a>
		<a href="https://github.com/discordjs/discord.js/actions"><img src="https://github.com/DeVinci-FabLab/MyFab/actions/workflows/Tests-back.yml/badge.svg" alt="Back status" /></a>
		<a href="https://github.com/discordjs/discord.js/actions"><img src="https://github.com/DeVinci-FabLab/MyFab/actions/workflows/Tests-front.yml/badge.svg" alt="Front status" /></a>
		<a href="https://github.com/discordjs/discord.js/actions"><img src="https://github.com/DeVinci-FabLab/MyFab/actions/workflows/Linter.yml/badge.svg" alt="Linter status" /></a>
  </p>
</div>

# MyFab

Bonjour ! Vous vous trouvez actuellement sur le respository de MyFab. Vous trouvez dans ce repository les fichiers pour faire fonctionner notre outils de ticketing pour des demande d'impression 3D.

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

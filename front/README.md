# ![enter image description here](https://www.fablabs.io/media/W1siZiIsIjIwMTcvMTAvMjUvMTMvNDgvMjQvZTQzZDgxMGUtM2ZiMy00MjZjLTlhNzYtOGFlYzg1ZWY1OGNjL0xPR08gREVWSU5DSSBGQUJMQUIucG5nIl0sWyJwIiwidGh1bWIiLCIzMDB4MzAwIl1d/LOGO%20DEVINCI%20FABLAB.png?sha=9ae18eebf0e6ea56)MyFab - Frontend

Bonjour ! Vous vous trouvez actuellement sur le respository de MyFab. Le site est basé sur du Next.JS en tant que framework React et Tailwind CSS pour le framework CSS. Ce projet est fait pour fonctionner avec le projet [Back](https://github.com/devincifablab/MyFabUltimate_Back).

### Installation:

1.  Cloner le repo.
2.  node@18.13.0 et npm@9.1.1 sont des prérequis.
3.  Renommer le fichier "renameme.env.local" en ".env.local". Vous pourrez par la suite configurer l'adresse de l'API.
4.  Exécutez dans le dossier du répertoire `npm install`.
5.  Et voilà, c'est prêt ! Il vous suffit d'exécuter ensuite `npm run dev` pour lancer le site en mode Dev.

### Installation en production

1.  Pour installer le projet en production, vous aurez besoin de ce projet et du [back end](https://github.com/devincifablab/MyFabUltimate_Back) dans le même dossier.

```
$ ll
drwxr-xr-x 1 Cody 197609   0 janv. 10 16:09 MyFabUltimate_Back/
drwxr-xr-x 1 Cody 197609   0 janv. 25 19:18 MyFabUltimate_Front/
```

2. Docker et docker-compose sont deux composants nécessaires pour la suite des étapes.
3. Avec un terminal, il faut lancer la commande `docker-compose up -d` et les images vont se télécharger et être build.
4. Après le build des images le site va être disponible (par défaut) sur `localhost:3000`.

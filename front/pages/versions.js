import React from "react";
import { getCookie } from "cookies-next";
import VersionBlock from "../components/versionBlock";

import { UserUse } from "../context/provider";

const versions = [
  {
    version: "1.0.0",
    date: "23-06-2023",
    message: "Création de MyFab",
    changes: [],
  },
  {
    version: "1.0.1",
    date: "29-06-2023",
    message: "Corrections de bugs mineurs",
    changes: [],
  },
  {
    version: "1.0.2",
    date: "02-12-2023",
    message: "Déploiement de Myfab sur le serveur du DVFL",
    changes: [],
  },
  {
    version: "1.0.3",
    date: "25-12-2023 (oui je taf le jour de noel)",
    changes: [
      "Mise en place de la clé DKIM pour les mails",
      "On peut appuyer sur la touche 'enter' pour se connecter (le bouton reste fonctionnel)",
      "Les écoles sont maintenant unique (le formulaire pour renseigner l'école ne possède plus de doublon)",
      "Changement du curseur sur le tableau des utilisateurs",
      "Ajout d'un sha254 du coté front (les personnes qui snifs le réseau verront des mots de passe hashé)",
      "Ajouts de tests End2End pour la page auth/register",
      "Plusieurs autres modifications mineurs",
    ],
  },
  {
    version: "1.0.4",
    date: "03-01-2024",
    changes: [
      "Résolution des problèmes avec les textes qui indique depuis quand les tickets ont été créé (exemple d'avant: entre 31/12/2023 et 01/01/2024 il y a 1an)",
      "Correction de la requête api lors de l'utilisation de la barre de recherche pour les utilisateurs et les tickets (les paramètres n'étaient pas les bons suite à une mise à jour de la bibliothèque axios)",
      "Certains menus n'affichaient pas l'année et l'école de l'utilisateur et affichait 'Ancien compte' (message par défaut). Les écoles sont maintenant correctement affichées",
      "Correction de l'école et années sur les tickets pour afficher celui du demandeur et pas celui de l'utilisateur de la session",
    ],
  },
  {
    version: "1.0.5",
    date: "16-01-2024",
    changes: [
      "Changement de texte sur le front",
      "Ajout du tpye de projet DVIC et pour certains types les numéros de groupe peuvent être null",
      "Correction d'erreurs avec les paramètres de la page 'newSuccess'",
      "Correction de la requète pour envoyer des messages (suite à une monté de version d'Axios)",
      "Changement de la sauvegarde des cookies dans le back (les cookies ne sont plus des fraudes)",
      "Ajout des mails pour prévenir les étudiants des messages envoyés par les membres du Fab",
    ],
  },
  {
    version: "1.0.6",
    date: "23-01-2024",
    changes: [
      "Fix du CSS dans les mails",
      "Retrait du message du nombre de tickets terminés pour un groupe, si le groupe est NULL",
      "Si la page `/panel/[Ticket_inconnu]` est accédé, le client est redirigé vers `/panel/`",
      "Création de la page `/versions`",
      "Ajout du status 'En attente de récupération' pour les tickets",
      "Mise à jour de la date de dernière modification d'un ticket si un message/satuts/fichier a été ajouté ou modifié",
    ],
  },
  ,
  {
    version: "1.0.7",
    date: "27-01-2024",
    changes: [
      "Ajout d'animations pour l'ouverture/fermeture de la FAQ",
      "Ajout d'une FAQ pour les rôles",
      "La page `/panel/admin` la colone `créé il y a` est devenu `modifié il y a`",
      "Mise à jour des CGU et création des redirections pour les signer",
    ],
  },
  ,
  {
    version: "1.1.0",
    date: "02-02-2024",
    changes: [
      "Ajout du darkMode",
      "Certaines données utilisateurs sont sauvegardé dans le navigateur pour diminuer le nombre de requêtes",
      "Ajout d'une date d'expiration d'un an pour les cookies après avoir cliqué sur 'se souvenir de moi' (les cookies ne seront plus supprimé à la fin de la session)",
      "Correction d'une erreur avec les valeurs en doublon lors de l'importation des tables sql",
      "Correction de la requête sql pour la validation automatique des CGU pour les utilisateurs par default",
      "Diminution du temps de démarrage du conteneur Front-End",
    ],
  },
  {
    version: "1.1.1",
    date: "04-03-2024",
    changes: [
      "Correction de la couleur du DarkMode dans la page /panel/:id",
      "Fix error with test mode and stl viewer",
      "Si le mot de passe est incorect lors de la connexion, le champ du mot de passe est vidé ",
    ],
  },
  ,
  {
    version: "1.2.0",
    date: "PAS-OFFICIEL",
    changes: [
      "Mise à jours des dépendences du front-end",
      "Correction d'un bug qui empêchait de signer les règles pour la nouvelle année scolaire",
      "Ajout d'une route de stats",
      "Lorsque un utilisateur entre un mauvais mot de passe, celui-ci est supprimé",
      "Les messages du chat dans un ticket s'affiche maintenant sur plusieurs lignes",
    ],
  },
];

const versionsToShow = versions.reverse();

const ProjectVersions = () => {
  const jwt = getCookie("jwt");
  const { darkMode } = UserUse(jwt);
  return (
    <div className={` ${darkMode ? "bg-gray-800" : ""}`}>
      <div
        className="max-w-3xl mx-auto py-10 text-center space-y-3"
        style={{ minWidth: "50%" }}
      >
        <h1
          className={`text-3xl md:text-4xl font-extrabold mb-4 ${
            darkMode ? "text-gray-200" : ""
          }`}
        >
          Liste des Versions de MyFab
        </h1>
        <ul>
          {versionsToShow.map((version, index) => (
            <VersionBlock key={index} version={version}>
              <div className="pb-2">
                <div className="flex justify-between">
                  <h2
                    className={`font-bold text-justify ${
                      darkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {version.version}
                  </h2>
                  <p className={darkMode ? "text-gray-300" : "text-gray-400"}>
                    {version.date}
                  </p>
                </div>
                {version.message && (
                  <p
                    className={`text-justify ${
                      darkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {version.message}
                  </p>
                )}
                {version.changes.length !== 0 && (
                  <div
                    className={`rounded-lg p-4 ${
                      darkMode
                        ? "text-gray-300 bg-gray-600"
                        : "text-gray-500 bg-gray-200"
                    }`}
                  >
                    {version.changes.map((change, index) => (
                      <p key={index} className="text-justify">
                        • {change}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </VersionBlock>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProjectVersions;

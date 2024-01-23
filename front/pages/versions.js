import React from "react";

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
];

const versionsToShow = versions.reverse();

const ProjectVersions = () => {
  // Remplacez ce tableau par les versions réelles de votre projet

  return (
    <div
      className="max-w-3xl mx-auto my-10 text-center space-y-3"
      style={{ minWidth: "50%" }}
    >
      <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
        Liste des Versions de MyFab
      </h1>
      <ul>
        {versionsToShow.map((version, index) => (
          <li key={index} className="border-b mt-4">
            <div className="flex justify-between">
              <h2 className="font-bold text-gray-500 text-justify">
                {version.version}
              </h2>
              <p className="text-gray-400">{version.date}</p>
            </div>
            {version.message && (
              <p className="text-justify">{version.message}</p>
            )}
            {version.changes.length !== 0 && (
              <div className="rounded-lg p-4 bg-gray-200">
                {version.changes.map((change, index) => (
                  <p key={index} className="text-justify">
                    • {change}
                  </p>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectVersions;

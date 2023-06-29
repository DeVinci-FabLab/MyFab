export function mock(path, jwt, options) {
  return {
    status: 200,
    data: [
      {
        id: 1,
        name: "Administrateur",
        description:
          "Ce role donne acces a tous les outils d'administration et de gestion du site",
        color: "db1010",
        isProtected: 1,
      },
      {
        id: 2,
        name: "Moderateur",
        description:
          "Ce role donne acces aux outils pour gerer le contenu et les utilisateurs du site",
        color: "eb9413",
        isProtected: 1,
      },
      {
        id: 3,
        name: "Agent MyFab",
        description:
          "Ce role donne acces aux outils de MyFab pour gerer les demandes du site",
        color: "e0dd22",
        isProtected: 0,
      },
      {
        id: 4,
        name: "Agent blog",
        description: "Ce role donne acces aux outils pour gerer le blog",
        color: "5865F2",
        isProtected: 0,
      },
    ],
  };

  return { error: true };
}

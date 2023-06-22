export function mock(path, jwt, options) {
  switch (jwt) {
    case "admin":
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
        ],
      };
    case "user":
      return {
        status: 200,
        data: [],
      };

    default:
      return { error: true };
  }
}

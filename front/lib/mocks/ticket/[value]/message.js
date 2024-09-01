export function mock(path, jwt, options) {
  const id = path.split("/")[2];
  switch (id) {
    case "1":
      return {
        status: 200,
        data: [
          {
            userName: "Etudiant 1",
            content: "Bonjour, est-ce que vous pouvez m'imprimer cette pièce",
            creationDate: "2023-06-21T10:49:06.000Z",
          },
          {
            userName: "Agent 1",
            content: "Oui bien sûr",
            creationDate: "2023-06-18T08:00:24.000Z",
          },
          {
            userName: "Etudiant 1",
            content: "Parfait, merci",
            creationDate: "2023-06-21T10:50:09.000Z",
          },
        ],
      };

    default:
      return { error: true };
  }
}

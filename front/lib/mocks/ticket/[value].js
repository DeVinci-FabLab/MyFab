export function mock(path, jwt, options) {
  const method = options?.method;
  if (method === "DELETE")
    return {
      status: 200,
    };

  const id = path.split("/")[2];
  switch (id) {
    case "1":
      return {
        status: 200,
        data: {
          id: 1,
          idUser: 1,
          userName: "Etudiant 1",
          userFirstName: "Etudiant",
          userLastName: "Etudiant",
          projectType: "P2IP",
          idProjectType: 3,
          title: "Test",
          email: "test@test.com",
          groupNumber: 5,
          creationDate: "2023-06-18T08:00:24.000Z",
          modificationDate: "2023-06-18T08:00:24.000Z",
          statusName: "Ouvert",
          isCancel: 0,
          statusColor: "2ca1bb",
          priorityName: "A traiter",
          priorityColor: "e9d41d",
          ticketCountUser: 1,
          ticketCountGroup: 0,
          material: "FDM",
          history: [
            {
              message: "Agent 1 a changé le type de projet en P2IP",
              timeStamp: "2023-06-18T08:52:51.000Z",
            },
          ],
          userCanCancel: true,
        },
      };

    default:
      return {
        status: 204,
      };
  }
}

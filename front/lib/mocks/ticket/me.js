export function mock(path, jwt, options) {
  const page = options?.params?.page;
  const date = new Date();
  switch (jwt) {
    case "admin":
    case "user":
      if (page !== 0)
        return {
          status: 200,
          data: {
            maxPage: 2,
            values: [
              {
                creationDate: date.setSeconds(date.getSeconds() - 1),
                groupNumber: 5,
                id: 3,
                isOpen: 1,
                modificationDate: "2023-12-24T20:36:24.000Z",
                priorityColor: "e9d41d",
                priorityName: "A traiter",
                projectType: "Page 2",
                statusColor: "2ca1bb",
                statusName: "Pas ouvert",
                title: "Date test",
                userName: "Secondes",
              },
              {
                creationDate: date.setMinutes(date.getMinutes() - 2),
                groupNumber: 5,
                id: 4,
                isOpen: 1,
                modificationDate: "2023-12-24T20:36:24.000Z",
                priorityColor: "e9d41d",
                priorityName: "A traiter",
                projectType: "Page 2",
                statusColor: "2ca1bb",
                statusName: "Pas ouvert",
                title: "Date test",
                userName: "Minutes",
              },
            ],
          },
        };
      return {
        status: 200,
        data: {
          maxPage: 2,
          values: [
            {
              creationDate: "2023-06-18T08:00:24.000Z",
              groupNumber: 5,
              id: 1,
              isOpen: 1,
              modificationDate: "2023-06-18T08:00:24.000Z",
              priorityColor: "e9d41d",
              priorityName: "A traiter",
              projectType: "Page 1",
              statusColor: "2ca1bb",
              statusName: "Ouvert",
              title: "Etudiant1",
              userName: "Etudiant 1",
              material: "FDM",
            },
            {
              creationDate: "2023-06-18T08:00:24.000Z",
              groupNumber: 5,
              id: 2,
              isOpen: 1,
              modificationDate: "2023-06-18T08:00:24.000Z",
              priorityColor: "e9d41d",
              priorityName: "A traiter",
              projectType: "Page 1",
              statusColor: "2ca1bb",
              statusName: "Ouvert",
              title: "Etudiant1",
              userName: "Etudiant 1",
              material: "FDM",
            },
          ],
        },
      };

    default:
      return { error: true };
  }
}

export function mock(path, jwt, options) {
  if (options.method === "POST") {
    return {
      status: 200,
      data: { id: 212 },
    };
  }
  const page = options?.params?.page;
  const date = new Date();
  switch (jwt) {
    case "admin":
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
                modificationDate: "2023-06-18T08:00:24.000Z",
                priorityColor: "e9d41d",
                priorityName: "A traiter",
                projectType: "Associatif",
                statusColor: "2ca1bb",
                statusName: "Ouvert",
                title: "Date test",
                userName: "Secondes",
                material: "FDM",
              },
              {
                creationDate: date.setMinutes(date.getMinutes() - 2),
                groupNumber: 5,
                id: 4,
                isOpen: 1,
                modificationDate: "2023-06-18T08:00:24.000Z",
                priorityColor: "e9d41d",
                priorityName: "A traiter",
                projectType: "Associatif",
                statusColor: "2ca1bb",
                statusName: "Ouvert",
                title: "Date test",
                userName: "Minutes",
                material: "FDM",
              },
              {
                creationDate: date.setHours(date.getHours() - 3),
                groupNumber: 5,
                id: 5,
                isOpen: 1,
                modificationDate: "2023-06-18T08:00:24.000Z",
                priorityColor: "e9d41d",
                priorityName: "A traiter",
                projectType: "Associatif",
                statusColor: "2ca1bb",
                statusName: "Ouvert",
                title: "Date test",
                userName: "Heures",
                material: "FDM",
              },
              {
                creationDate: date.setDate(date.getDate() - 4),
                groupNumber: 5,
                id: 6,
                isOpen: 1,
                modificationDate: "2023-06-18T08:00:24.000Z",
                priorityColor: "e9d41d",
                priorityName: "A traiter",
                projectType: "Associatif",
                statusColor: "2ca1bb",
                statusName: "Ouvert",
                title: "Date test",
                userName: "Jours",
                material: "FDM",
              },
              {
                creationDate: date.setMonth(date.getMonth() - 5),
                groupNumber: 5,
                id: 7,
                isOpen: 1,
                modificationDate: "2023-06-18T08:00:24.000Z",
                priorityColor: "e9d41d",
                priorityName: "A traiter",
                projectType: "Associatif",
                statusColor: "2ca1bb",
                statusName: "Ouvert",
                title: "Date test",
                userName: "Mois",
                material: "FDM",
              },
              {
                creationDate: date.setFullYear(date.getFullYear() - 6),
                groupNumber: 5,
                id: 8,
                isOpen: 1,
                modificationDate: "2023-06-18T08:00:24.000Z",
                priorityColor: "e9d41d",
                priorityName: "A traiter",
                projectType: "Associatif",
                statusColor: "2ca1bb",
                statusName: "Ouvert",
                title: "Date test",
                userName: "Années",
                material: "FDM",
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
              projectType: "Test",
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
              projectType: "Test",
              statusColor: "2ca1bb",
              statusName: "Ouvert",
              title: "Etudiant1",
              userName: "Etudiant 1",
              material: "SLA",
            },
          ],
        },
      };

    default:
      return { error: true };
  }
}

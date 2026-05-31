export function mock(path, jwt, options) {
  return {
    status: 200,
    data: [
      {
        id: 1,
        projectType: "PIX",
        groupNumber: "401E",
        creationDate: "2026-05-20T10:00:00.000Z",
        modificationDate: "2026-05-22T10:00:00.000Z",
        statusName: "Ouvert",
        statusColor: "2ca1bb",
        isOpen: 1,
        priorityName: "Normal",
        priorityColor: "2274e0",
        material: "FDM",
      },
      {
        id: 2,
        projectType: "Associatif",
        groupNumber: null,
        creationDate: "2026-04-12T10:00:00.000Z",
        modificationDate: "2026-04-15T10:00:00.000Z",
        statusName: "Fermé",
        statusColor: "18c100",
        isOpen: 0,
        priorityName: "Normal",
        priorityColor: "2274e0",
        material: "FDM",
      },
    ],
  };
}

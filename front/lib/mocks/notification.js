export function mock(path, jwt, options) {
  return {
    status: 200,
    data: {
      unread: 1,
      values: [
        {
          id: 2,
          message: "Demande #0040 : En attente de réponse",
          link: "/panel/40",
          isRead: 0,
          creationDate: "2026-05-31T12:00:00.000Z",
        },
        {
          id: 1,
          message: "Nouveau message sur la demande #0042",
          link: "/panel/42",
          isRead: 1,
          creationDate: "2026-05-30T09:30:00.000Z",
        },
      ],
    },
  };
}

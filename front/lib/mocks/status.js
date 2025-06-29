export function mock(path, jwt, options) {
  return {
    status: 200,
    data: [
      {
        id: 1,
        name: "Ouvert",
        color: "2ca1bb",
      },
      {
        id: 2,
        name: "En attente de réponse",
        color: "f49a2c",
      },
      {
        id: 3,
        name: "Refusé",
        color: "ff1e1e",
      },
      {
        id: 4,
        name: "Impression commencée",
        color: "1E90FF",
      },
      {
        id: 5,
        name: "Fermé",
        color: "18c100",
      },
    ],
  };
}

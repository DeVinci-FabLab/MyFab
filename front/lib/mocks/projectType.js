export function mock(path, jwt, options) {
  return {
    status: 200,
    data: [
      {
        id: 1,
        name: "PIX",
      },
      {
        id: 2,
        name: "PIX2",
      },
      {
        id: 3,
        name: "P2IP",
      },
      {
        id: 4,
        name: "PI²",
      },
      {
        id: 5,
        name: "Associatif",
      },
      {
        id: 6,
        name: "Autre",
      },
    ],
  };
}

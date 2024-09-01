export function mock(path, jwt, options) {
  return {
    status: 200,
    data: [
      {
        id: 1,
        name: "Ecole1",
      },
      {
        id: 2,
        name: "Ecole2",
      },
      {
        id: 3,
        name: "Ecole3",
      },
      {
        id: 4,
        name: "Ecole4",
      },
      {
        id: 5,
        name: "Ecole5",
      },
      {
        id: 6,
        name: "Ecole6",
      },
    ],
  };
}

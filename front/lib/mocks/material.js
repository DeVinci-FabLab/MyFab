export function mock(path, jwt, options) {
  return {
    status: 200,
    data: [
      {
        id: 1,
        name: "FDM",
      },
      {
        id: 2,
        name: "SLA",
      },
      {
        id: 3,
        name: "SLS",
      },
    ],
  };
}

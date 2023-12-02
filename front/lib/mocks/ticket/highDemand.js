export function mock(path, jwt, options) {
  switch (jwt) {
    case "userHighDemand":
      return {
        status: 200,
        data: { result: true },
      };

    default:
      return {
        status: 200,
        data: { result: false },
      };
  }
}

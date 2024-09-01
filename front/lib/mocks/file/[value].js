export function mock(path, jwt, options) {
  const id = path.split("/")[2];
  switch (id) {
    case "1":
      return {
        status: 200,
        data: {},
      };

    default:
      return { error: true };
  }
}

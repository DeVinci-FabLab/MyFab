export function mock(path, jwt, options) {
  switch (options.data.actualPassword) {
    case "Good-password":
      return {
        status: 200,
      };

    case "Wrong-password":
      return {
        status: 204,
      };

    default:
      return { error: true };
  }
}

export function mock(path, jwt, options) {
  switch (options.data.actualPassword) {
    case "9d29557bc145f8d7d4b3f17b46ceae7cd8bae843fda4446af5bd2d5c78c5609a": //Good-password
      return {
        status: 200,
      };

    case "77e6c61931e469c99954eee767188e571ab1054f755c12fdbe72c9fb6371cf05": //Wrong-password
      return {
        status: 204,
      };

    default:
      console.log(options.data.actualPassword);
      return { error: true };
  }
}

export function mock(path, jwt, options) {
  const id = path.split("/")[2];
  if (id) {
    return {
      status: 200,
      data: { noProcess: true },
    };
  }
  return { error: true };
}

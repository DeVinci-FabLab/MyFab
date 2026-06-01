export function mock(path, jwt, options) {
  const id = path.split("/")[2];
  // En mode test, on accepte le toggle pour tous les tickets connus.
  if (id) {
    return {
      status: 200,
      data: { pinned: true },
    };
  }
  return { error: true };
}

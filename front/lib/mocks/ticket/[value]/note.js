export function mock(path, jwt, options) {
  const id = path.split("/")[2];
  // En mode test, on accepte la sauvegarde de note pour tous les tickets connus.
  if (id) {
    return {
      status: 200,
    };
  }
  return { error: true };
}

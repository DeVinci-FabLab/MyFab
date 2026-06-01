export function mock(path, jwt, options) {
  return {
    status: 200,
    data: { open: 2, aTraiter: 1, urgent: 0, waitingPickup: 0 },
  };
}

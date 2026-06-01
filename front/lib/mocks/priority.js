export function mock(path, jwt, options) {
  return {
    status: 200,
    data: [
      { id: 1, name: "Normal", color: "2274e0" },
      { id: 2, name: "A traiter", color: "e9d41d" },
      { id: 3, name: "Urgent", color: "f30b0b" },
      { id: 4, name: "Ne pas traiter", color: "626262" },
    ],
  };
}

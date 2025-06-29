export function mock(path, jwt, options) {
  return {
    status: 200,
    data: [
      {
        email: "test1@test.com",
        token: "https://www.youtube.com/watch?v=LoJ5flCZR9Q",
      },
      {
        email: "test2@test.com",
        token: "https://www.youtube.com/watch?v=eq6R8OV0yPg",
      },
    ],
  };
}

export function mock(path, jwt, options) {
  switch (jwt) {
    case "admin":
      return {
        status: 200,
        data: {
          id: 1,
          firstName: "admin",
          lastName: "admin",
          email: "admin@test.com",
          creationDate: "2015-10-19T22:24:66.212Z",
          discordid: null,
          language: "fr",
          title: "Test",
          isMicrosoft: 0,
          acceptedRule: 1,
          mailValidated: 1,
        },
      };
    case "modo":
      return {
        status: 200,
        data: {
          id: 2,
          firstName: "modo",
          lastName: "modo",
          email: "modo@test.com",
          creationDate: "2015-10-19T22:24:66.212Z",
          discordid: null,
          language: "fr",
          title: "Test",
          isMicrosoft: 0,
          acceptedRule: 1,
          mailValidated: 1,
        },
      };
    case "user":
      return {
        status: 200,
        data: {
          id: 4,
          firstName: "user",
          lastName: "user",
          email: "user@test.com",
          creationDate: "2015-10-19T22:24:66.212Z",
          discordid: null,
          language: "fr",
          title: "Test",
          isMicrosoft: 0,
          acceptedRule: 1,
          mailValidated: 1,
        },
      };

    default:
      return { error: true };
  }
}

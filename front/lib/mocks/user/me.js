export function mock(path, jwt, options) {
  switch (jwt) {
    case "admin":
      return {
        status: 200,
        data: {
          id: 1,
          firstName: "root",
          lastName: "root",
          email: "root@root.com",
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
          email: "user@user.com",
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

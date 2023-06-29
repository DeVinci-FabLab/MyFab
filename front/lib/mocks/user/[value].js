export function mock(path, jwt, options) {
  const id = path.split("/")[2];

  switch (id) {
    case "1":
      return {
        status: 200,
        data: {
          id: 1,
          firstName: "admin",
          lastName: "admin",
          email: "admin@admin.com",
          creationDate: "2015-10-19T22:24:66.212Z",
          discordid: null,
          language: "fr",
          title: "Test",
          isMicrosoft: 0,
          acceptedRule: 1,
          mailValidated: 1,
        },
      };

    case "2":
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

    case "3":
      return {
        status: 200,
        data: {
          id: 4,
          firstName: "user1",
          lastName: "user1",
          email: "user1@test.com",
          creationDate: "2015-10-19T22:24:66.212Z",
          discordid: null,
          language: "fr",
          title: "Test",
          isMicrosoft: 0,
          acceptedRule: 1,
          mailValidated: 1,
        },
      };

    case "4":
      return {
        status: 200,
        data: {
          id: 4,
          firstName: "user2",
          lastName: "user2",
          email: "user2@test.com",
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

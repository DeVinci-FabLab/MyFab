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
          schoolValid: true,
          isMicrosoft: 0,
          acceptedRule: 1,
          mailValidated: 1,
          darkMode: process.env.DARK_MODE_IN_TEST_MODE === "true" ? 1 : 0,
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
          schoolValid: true,
          isMicrosoft: 0,
          acceptedRule: 1,
          mailValidated: 1,
          darkMode: process.env.DARK_MODE_IN_TEST_MODE === "true" ? 1 : 0,
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
          schoolValid: true,
          isMicrosoft: 0,
          acceptedRule: 1,
          mailValidated: 1,
          darkMode: process.env.DARK_MODE_IN_TEST_MODE === "true" ? 1 : 0,
        },
      };
    case "user_test_school_panel":
      return {
        status: 200,
        data: {
          id: 4,
          firstName: "user",
          lastName: "user",
          email: "user_test_school_panel@test.com",
          creationDate: "2015-10-19T22:24:66.212Z",
          discordid: null,
          language: "fr",
          title: "Test",
          schoolValid: false,
          isMicrosoft: 0,
          acceptedRule: 1,
          mailValidated: 1,
          darkMode: process.env.DARK_MODE_IN_TEST_MODE === "true" ? 1 : 0,
        },
      };
    case "user_need_to_accept_rule":
      return {
        status: 200,
        data: {
          id: 4,
          firstName: "user_need_to_accept_rule",
          lastName: "user_need_to_accept_rule",
          email: "user_need_to_accept_rule@test.com",
          creationDate: "2015-10-19T22:24:66.212Z",
          discordid: null,
          language: "fr",
          title: "Test",
          schoolValid: true,
          isMicrosoft: 0,
          acceptedRule: 0,
          mailValidated: 1,
          darkMode: process.env.DARK_MODE_IN_TEST_MODE === "true" ? 1 : 0,
        },
      };

    default:
      return { error: true };
  }
}

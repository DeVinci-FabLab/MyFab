export function mock(path, jwt, options) {
  switch (jwt) {
    case "admin":
      return {
        status: 200,
        data: {
          viewUsers: 1,
          manageUser: 1,
          changeUserRole: 1,
          changeUserProtectedRole: 1,
          myFabAgent: 1,
          blogAuthor: 1,
          acceptedRule: 1,
        },
      };

    case "modo":
      return {
        status: 200,
        data: {
          viewUsers: 1,
          manageUser: 1,
          changeUserRole: 1,
          changeUserProtectedRole: 0,
          myFabAgent: 1,
          blogAuthor: 1,
          acceptedRule: 1,
        },
      };

    case "user":
      return {
        status: 200,
        data: {
          viewUsers: 0,
          manageUser: 0,
          changeUserRole: 0,
          changeUserProtectedRole: 0,
          myFabAgent: 0,
          blogAuthor: 0,
          acceptedRule: 1,
        },
      };

    case "user_test_school_panel":
      return {
        status: 200,
        data: {
          viewUsers: 0,
          manageUser: 0,
          changeUserRole: 0,
          changeUserProtectedRole: 0,
          myFabAgent: 0,
          blogAuthor: 0,
          acceptedRule: 1,
        },
      };

    case "user_need_to_accept_rule":
      return {
        status: 200,
        data: {
          viewUsers: 0,
          manageUser: 0,
          changeUserRole: 0,
          changeUserProtectedRole: 0,
          myFabAgent: 1,
          blogAuthor: 0,
          acceptedRule: 0,
        },
      };

    case "1410":
    case "1212":
      return {
        status: 200,
        data: {
          viewUsers: 0,
          manageUser: 0,
          changeUserRole: 0,
          changeUserProtectedRole: 0,
          myFabAgent: 0,
          blogAuthor: 0,
          acceptedRule: 1,
        },
      };

    default:
      return { error: true };
  }
}

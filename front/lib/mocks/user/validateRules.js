export function mock(path, jwt, options) {
  switch (jwt) {
    case "admin":
      return {
        status: 200,
      };
    case "modo":
      return {
        status: 200,
      };
    case "user":
      return {
        status: 200,
      };
    case "user_test_school_panel":
      return {
        status: 200,
      };
    case "user_need_to_accept_rule":
      return {
        status: 200,
      };

    default:
      return { error: true };
  }
}

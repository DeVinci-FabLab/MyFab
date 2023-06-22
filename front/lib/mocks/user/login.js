export function mock(path, jwt, options) {
  if (!options.data.email || !options.data.password) {
    return { error: true };
  }

  switch (options.data.email) {
    case "admin@admin.com":
      return { status: 200, data: { dvflCookie: "admin" } };
    case "user@user.com":
      return { status: 200, data: { dvflCookie: "user" } };

    default:
      return { error: true };
  }
}

export function mock(path, jwt, options) {
  console.log(options.data);
  if (
    !options.data.email ||
    !options.data.firstName ||
    !options.data.lastName ||
    !options.data.password
  ) {
    return { error: true };
  }

  switch (options.data.email) {
    case "test@test.com":
      return { status: 200 };
    case "user@user.com":
      return { status: 200 };

    default:
      return { error: true };
  }
}

function applyRegex(path) {
  let pathRegexResult = path.replace(/\d/, "[value]");

  if (path !== pathRegexResult) return applyRegex(pathRegexResult);
  return pathRegexResult;
}

export function mockApi(path, jwt) {
  const options = typeof path === "string" ? null : path;
  jwt = typeof path === "string" ? jwt : path.headers?.dvflCookie;
  path =
    typeof path === "string"
      ? path
      : path.url.replace(process.env.API + "/api", "");
  if (path[path.length - 1] === "/") path = path.slice(0, -1);
  const pathRegexResult = applyRegex(path);

  try {
    return require(__dirname + "/mocks" + pathRegexResult).mock(
      path,
      jwt,
      options,
    );
  } catch (error) {
    console.log(pathRegexResult);
    return { error: true };
  }
}

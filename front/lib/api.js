import cookie from "cookie";

export function getURL(path = "") {
  return `${process.env.API + "/api"}${path}`;
}

export async function fetchAPIAuth(path, jwt) {
  const requestUrl = getURL(path);
  const response = await fetch(requestUrl, {
    method: "get",
    headers: new Headers({
      dvflCookie: "" + jwt,
      "Content-Type": "application/x-www-form-urlencoded",
    }),
  });

  var data;
  if (response.status != 200) {
    data = {
      error: "unauthorized",
    };
  } else {
    data = await response.json();
  }

  return data;
}

export function parseCookies(req) {
  return cookie.parse(req ? req.headers.cookie || "" : document.cookie);
}

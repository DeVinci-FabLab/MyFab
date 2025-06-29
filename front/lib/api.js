import axios from "axios";
import cookie from "cookie";
import { mockApi } from "./mockApi";

export function getURL(path = "") {
  return `${process.env.API + "/api"}${path}`;
}

export async function fetchAPIAuth(path, jwt) {
  const isFetch = typeof path === "string";
  if (process.env.IS_TEST_MODE === "true") {
    return mockApi(path, jwt);
  } else {
    return await new Promise(async (resolve, reject) => {
      const options = isFetch
        ? {
            method: "GET",
            headers: {
              dvflCookie: jwt ? jwt : null,
            },
            url: getURL(path),
          }
        : path;

      try {
        const response = await axios(options);
        return resolve(response);
      } catch (error) {
        return resolve({ error });
      }
    });
  }
}

export function parseCookies(req) {
  return cookie.parse(req ? req.headers.cookie || "" : document.cookie);
}

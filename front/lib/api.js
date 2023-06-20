import axios from "axios";
import cookie from "cookie";
import { mockApi } from "./mockApi";

export function getURL(path = "") {
  return `${process.env.API + "/api"}${path}`;
}

export async function fetchAPIAuth(path, jwt) {
  if (process.env.IS_TEST_MODE) {
    return mockApi(path, jwt);
  } else {
    return await new Promise((resolve, reject) => {
      const options =
        typeof path === "string"
          ? {
              method: "GET",
              headers: {
                dvflCookie: jwt ? jwt : null,
              },
              url: getURL(path),
            }
          : path;
      axios(options)
        .then(async (response) => {
          var data;
          if (response.status != 200) {
            data = {
              error: "unauthorized",
            };
          } else {
            data = await response.data;
          }
          resolve(data);
        })
        .catch((e) => {
          resolve({ error: e });
        });
    });
  }
}

export function parseCookies(req) {
  return cookie.parse(req ? req.headers.cookie || "" : document.cookie);
}

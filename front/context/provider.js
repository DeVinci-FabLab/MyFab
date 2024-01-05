import { createContext, useContext, useState } from "react";
import { fetchAPIAuth } from "../lib/api";

const UserContext = createContext();
const loadingUser = {
  id: 0,
  firstName: "Loading",
  lastName: "Loading",
  email: "Loading@loading.com",
  creationDate: "2015-10-19T22:24:66.212Z",
  discordid: null,
  language: "fr",
  title: "Loading",
  schoolValid: true,
  isMicrosoft: 0,
  acceptedRule: 1,
  mailValidated: 1,
  darkMode: 1,
};

export function Provider({ children }) {
  const [user, setUser] = useState(loadingUser);
  const value = { user, setUser };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const UserUse = (cookies) => {
  const { user, setUser } = useContext(UserContext);
  if (cookies === undefined) {
    return { user: { error: 404 } };
  }

  function updateUser() {
    if (!cookies) cookies = user?.cookies;
    if (user.id !== loadingUser.id) setUser(loadingUser);
    fetchAPIAuth("/user/me", cookies).then((apiUser) => {
      if (apiUser.error) return;
      apiUser.data.cookies = cookies;
      setUser(apiUser.data);
    });
  }

  if (user.cookies !== cookies) {
    updateUser(cookies);
  }

  return { user, setUser, updateUser };
};

export default UserContext;

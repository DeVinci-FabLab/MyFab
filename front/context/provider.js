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
  const [darkMode, setDarkMode] = useState(false);
  const [roles, setRoles] = useState([]);
  const value = { user, setUser, darkMode, setDarkMode, roles, setRoles };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const UserUse = (cookies, actionAfterFech) => {
  const { user, setUser, darkMode, setDarkMode, roles, setRoles } =
    useContext(UserContext);

  function resetUser() {
    setUser(loadingUser);
    setRoles([]);
  }

  function updateUser() {
    if (!cookies) cookies = user?.cookies;
    if (user.id !== loadingUser.id) {
      resetUser();
    }
    fetchAPIAuth("/user/me", cookies).then((apiUser) => {
      if (apiUser.error) return;
      apiUser.data.cookies = cookies;
      setUser(apiUser.data);
      setDarkMode(apiUser.data.darkMode);

      fetchAPIAuth("/user/role", cookies).then((apiRoles) => {
        if (apiRoles.error) return;
        setRoles(apiRoles.data);
        if (apiRoles.data.length) {
          const now = new Date();
          const date = now.getDate();
          const month = now.getMonth();
          if (`${date}/${month + 1}` === "4/5") {
            // Le 4 mai (may the force)
            apiUser.data.specialFont = "font-aurebesh";
            setUser(apiUser.data);
          } else if (`${date}/${month + 1}` === "6/5") {
            // Le 6 mai (may the sith)
            apiUser.data.specialFont = "font-sith";
            setUser(apiUser.data);
          }
        }

        if (actionAfterFech) actionAfterFech({ user });
      });
    });
  }

  function setCookies(newCookies) {
    cookies = newCookies;
    if (!cookies) {
      resetUser();
    } else {
      updateUser(cookies);
    }
  }

  if (cookies !== undefined && user.cookies !== cookies) {
    updateUser(cookies);
  } else if (actionAfterFech) actionAfterFech({ user });

  return {
    user,
    setUser,
    darkMode,
    setDarkMode,
    roles,
    setRoles,
    updateUser,
    setCookies,
  };
};

export default UserContext;

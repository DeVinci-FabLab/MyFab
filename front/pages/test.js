import { getCookie } from "cookies-next";
import { UserUse } from "../context/provider";

export default function Rules({ userNeedToAccept }) {
  const jwt = getCookie("jwt");
  const { user, setUser, contextError } = UserUse(jwt);

  return <div>{user.firstName}</div>;
}

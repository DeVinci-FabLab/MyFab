import { getCookie } from "cookies-next";
import { UserUse } from "../../context/provider";

export default function Test({}) {
  const jwt = getCookie("jwt");
  const { user, setUser } = UserUse(jwt);
  return <p>{user.firstName}</p>;
}

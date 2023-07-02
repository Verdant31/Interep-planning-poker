import { parseCookies } from "nookies";

export const getUseriD = () => {
  const cookies = parseCookies();
  const id = cookies.userId ? cookies.userId : null;

  return id;
};

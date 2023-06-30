/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { parseCookies } from "nookies";

export const getUser = () => {
  const cookies = parseCookies();
  const user = cookies.userId ? cookies.userId : null;
  return user;
};

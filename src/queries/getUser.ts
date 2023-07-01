/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { parseCookies } from "nookies";

export const getUseriD = () => {
  const cookies = parseCookies();
  const id = cookies.userId ? cookies.userId : null;

  return id;
};

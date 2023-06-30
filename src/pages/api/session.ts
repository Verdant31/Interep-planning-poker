/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { sessionId } = JSON.parse(req.body);
    const session = await prisma.session.findFirst({
      where: { id: sessionId as string },
    });
    return res.status(200).json({ session });
  } catch (err) {
    console.log(err);
  }
}

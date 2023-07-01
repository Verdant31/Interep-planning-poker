/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { sessionId, userId } = JSON.parse(req.body);
    const session = await prisma.session.update({
      where: { id: sessionId as string },
      data: {
        users: {
          connect: { id: userId as string },
        },
      },
      select: {
        id: true,
        users: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return res.status(200).json({ session });
  } catch (err) {
    console.log(err);
  }
}

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
    const session = await prisma.session.findUnique({
      where: { id: sessionId as string },
      select: {
        users: true,
      },
    });
    if (!session) return;

    const newUsers = [...session.users, userId as string];

    const updated = await prisma.session.update({
      where: { id: sessionId as string },
      data: {
        users: newUsers,
      },
      select: {
        id: true,
        users: true,
      },
    });
    return res.status(200).json({ updated });
  } catch (err) {
    console.log(err);
  }
}

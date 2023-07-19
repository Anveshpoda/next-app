// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { PrismaClient } from "@prisma/client";

// export default function handler(req, res) {
//   res.status(200).json({ name: 'John Doe' })
// }

export default async function handler(req, res) {
  const prisma = new PrismaClient();
  const users = await prisma.user.findMany();
  res.status(200).json(users)
}
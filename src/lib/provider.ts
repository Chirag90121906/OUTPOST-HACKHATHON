import { prisma } from "./db";

export async function getProviderForUser(userId: string) {
  return prisma.provider.findUnique({ where: { userId } });
}

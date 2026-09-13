import "dotenv/config";
import {PrismaPg} from "@prisma/adapter-pg";
import {PrismaClient} from "@prisma/client";

const adapter = new PrismaPg({
  ConnectionString: process.env.DATABASE_URL,
});

export const db = new PrismaClient({
  adapter,
});







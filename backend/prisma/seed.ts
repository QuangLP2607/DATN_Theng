import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const defaultUsers = [
  {
    email: "admin@gmail.com",
    password: "123456",
    name: "System Administrator",
    role: "ADMIN" as const,
  },
  {
    email: "teacher@gmail.com",
    password: "123456",
    name: "Default Teacher",
    role: "TEACHER" as const,
  },
  {
    email: "student@gmail.com",
    password: "123456",
    name: "Default Student",
    role: "STUDENT" as const,
  },
];

async function main() {
  for (const user of defaultUsers) {
    const passwordHash = await bcrypt.hash(user.password, 12);

    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        passwordHash,
        name: user.name,
        role: user.role,
        status: "ACTIVE",
        emailVerifiedAt: new Date(),
        activationTokenHash: null,
        activationTokenExpiresAt: null,
      },
      create: {
        email: user.email,
        passwordHash,
        name: user.name,
        role: user.role,
        status: "ACTIVE",
        emailVerifiedAt: new Date(),
        activationTokenHash: null,
        activationTokenExpiresAt: null,
      },
    });

    console.log(`Seeded ${user.role}: ${user.email}`);
  }

  console.log("\nDefault accounts:");
  console.table(
    defaultUsers.map(({ email, password, role }) => ({
      email,
      password,
      role,
      status: "ACTIVE",
      emailVerified: true,
    })),
  );
}

main()
  .catch((error) => {
    console.error("Failed to seed default accounts:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

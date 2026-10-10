import { DefaultSession } from "next-auth";
import { Role } from "@/generated/prisma/enums";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role | string;
      isDemo?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    role?: Role | string;
    isDemo?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role | string;
    isDemo?: boolean;
  }
}

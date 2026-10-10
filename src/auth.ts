import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";
import { findUserByEmail } from "@/lib/user-store";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).toLowerCase().trim();
        const password = String(credentials.password);

        // Immediate check for Demo User bypass
        if (email === "demo@luminaportal.com" && password === "demoPassword2026!") {
          return {
            id: "demo-user-id-001",
            name: "Alex Vance (Demo)",
            email: "demo@luminaportal.com",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            role: "DEMO",
            isDemo: true,
          };
        }

        try {
          const user = await findUserByEmail(email);

          if (!user || !user.password) {
            return null;
          }

          const isPasswordMatch = await bcrypt.compare(password, user.password);
          if (!isPasswordMatch) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
            isDemo: user.role === "DEMO",
          };
        } catch (dbError) {
          console.warn("User lookup failed during auth:", (dbError as Error).message);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET || "fallback_secret_lumina_portal_for_dev_mode_32chars_min",
});

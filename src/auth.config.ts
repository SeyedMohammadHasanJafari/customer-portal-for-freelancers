import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET || "fallback_secret_lumina_portal_for_dev_mode_32chars_min",
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

      if (isOnDashboard) {
        return isLoggedIn;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "FREELANCER";
        token.isDemo = user.role === "DEMO";
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.id as string) || token.sub || "";
        session.user.role = (token.role as string) || "FREELANCER";
        session.user.isDemo = token.isDemo === true;
      }
      return session;
    },
  },
  providers: [],
};

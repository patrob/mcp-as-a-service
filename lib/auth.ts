import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { UserService } from "./user-service";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log("NextAuth redirect callback:", { url, baseUrl });

      // Filter out Chrome DevTools or extension requests
      if (url.includes("/.well-known/appspecific/com.chrome.devtools.json")) {
        return baseUrl + "/dashboard";
      }

      // Allows relative callback URLs
      if (url.startsWith("/")) {
        const redirectUrl = `${baseUrl}${url}`;
        console.log("Redirecting to relative URL:", redirectUrl);
        return redirectUrl;
      }

      // Allows callback URLs on the same origin
      try {
        if (new URL(url).origin === baseUrl) {
          console.log("Redirecting to same origin URL:", url);
          return url;
        }
      } catch (error) {
        // Invalid URL format, fall through to default redirect
        console.log("Invalid URL format, redirecting to dashboard:", url);
      }

      // Default redirect to dashboard
      const dashboardUrl = `${baseUrl}/dashboard`;
      console.log("Redirecting to dashboard:", dashboardUrl);
      return dashboardUrl;
    },
    async signIn({ user, account, profile }) {
      console.log("NextAuth signIn callback:", {
        user: user?.email,
        account: account?.provider,
      });

      if (user?.email) {
        try {
          const userService = new UserService();
          const username = user.name || user.email.split("@")[0];
          await userService.createUser(user.email, username);
          console.log("User created/updated in database:", user.email);
        } catch (error) {
          console.error("Failed to create user in database:", error);
          // Still allow sign in even if user creation fails
        }
      }

      return true;
    },
    async session({ session, token }) {
      console.log("NextAuth session callback:", {
        session: session?.user?.email,
      });

      // Add user ID to session if available
      if (session?.user?.email) {
        try {
          const userService = new UserService();
          const user = await userService.getUserByEmail(session.user.email);
          if (user) {
            session.user.id = user.id;
            session.user.stripeCustomerId = user.stripe_customer_id;
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }

      return session;
    },
  },
};


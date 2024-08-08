import NextAuth, { NextAuthOptions, SessionStrategy } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

// Define the authentication providers
const authProviders = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    authorization: {
      params: {
        prompt: "consent",
        access_type: "offline",
        response_type: "code",
      },
    },
  }),
  GitHubProvider({
    clientId: process.env.GITHUB_CLIENT_ID as string,
    clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    authorization: {
      params: {
        prompt: "consent",
        access_type: "offline",
        response_type: "code",
      },
    },
  }),
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials) => {
      try {
        const response = await axios.post("http://localhost:8080/user/login", {
          email: credentials?.email,
          password: credentials?.password,
        });

        if (response.status === 200) {
          return {
            id: response.data.userId,
            email: credentials?.email,
            name: response.data.user.name,
          };
        } else {
          return null;
        }
      } catch (error) {
        return null;
      }
    },
  }),
];

// Define the NextAuth options
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  providers: authProviders,
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

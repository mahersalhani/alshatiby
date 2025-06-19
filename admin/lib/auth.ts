import NextAuth from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import { getUserByEmail, type User } from "./data";
import api from "./axios";

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;
        const { email, password } = credentials;
        console.log("AUTHORIZING", email, password);

        const user = await api.post("/auth/local", {
          identifier: email,
          password,
        });

        console.log("TESTESTEST", user.data);

        if (user.status === 200) {
          const userData: User = user.data.user;
          return userData;
        }

        throw new Error("Invalid credentials");
      },
    }),
  ],
});

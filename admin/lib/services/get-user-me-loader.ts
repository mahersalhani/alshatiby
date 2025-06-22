import { cookies } from "next/headers";
import { getAuthToken } from "./get-token";
import { redirect } from "@/components/navigation";
import api from "../axios";

export async function auth() {
  const authToken = await getAuthToken();
  if (!authToken) return { ok: false, user: null, error: null, session: null };

  try {
    const response = await api.get("/users/me", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.status === 200) {
      return {
        ok: true,
        user: response.data,
        error: null,
        session: authToken,
      };
    } else {
      return { ok: false, user: null, error: response.data, session: null };
    }
  } catch (error) {
    return { ok: false, user: null, error: error as Error, session: null };
  }
}

const config = {
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: "/",
  domain: process.env.HOST ?? "localhost",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

export async function signOut() {
  "use server";
  console.log("signOut called");
  const cookieStore = await cookies();
  cookieStore.set("auth_token", "", { ...config, maxAge: 0 });
  redirect({ href: "/auth/login", locale: "ar" }); // TODO handle locale dynamically
}

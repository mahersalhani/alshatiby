import { cookies } from "next/headers";
import api from "../axios";
import { getAuthToken } from "./get-token";
import { redirect } from "next/navigation";

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
  const cookieStore = await cookies();
  cookieStore.set("jwt", "", { ...config, maxAge: 0 });
  redirect("/auth/login");
}

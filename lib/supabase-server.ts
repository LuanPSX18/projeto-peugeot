import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function makeServerClient(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Route handlers may not set cookies — safe to ignore
          }
        },
      },
    },
  );
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const supabase = makeServerClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function signIn(email: string, password: string) {
  const cookieStore = await cookies();
  const supabase = makeServerClient(cookieStore);
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  const cookieStore = await cookies();
  const supabase = makeServerClient(cookieStore);
  return supabase.auth.signOut();
}

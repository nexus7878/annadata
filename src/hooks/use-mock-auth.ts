export function useSession() {
  return {
    data: {
      user: {
        name: "Demo User",
        email: "demo@annadata.com",
        image: null,
      },
    },
    status: "authenticated",
  };
}

export async function signIn(provider?: string, options?: any): Promise<any> {
  if (typeof window !== "undefined") {
    console.log("Mock signIn called, redirecting to dashboard");
    window.location.href = options?.callbackUrl || "/dashboard";
  }
  return { ok: true, error: null };
}

export function signOut(options?: any) {
  if (typeof window !== "undefined") {
    console.log("Mock signOut called, redirecting home");
    window.location.href = options?.callbackUrl || "/";
  }
}

"use client";

import { useEffect } from "react";

import { useRouter } from "@/i18n/navigation";
import { AuthRepository } from "@/services";
import { useAuthStore } from "@/store";

export default function LogoutPage() {
  const router = useRouter();
  const clearSession = useAuthStore((s) => s.clearSession);

  useEffect(() => {
    (async () => {
      try {
        await AuthRepository.logout();
      } catch {
        // ignore
      } finally {
        clearSession();
        router.push("/login");
      }
    })();
  }, [clearSession, router]);

  return <div className="p-6">Signing out…</div>;
}

"use client";

import { useAuthStore } from "@/store/authStore";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import HomePage from "@/pages/HomePage";
import { AdminPage } from "./admin/AdminPage";

export default function Page() {
  const { user, loading } = useAuthStore();
  const [renderPage, setRenderPage] = useState<JSX.Element | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
    } else {
      const page = user.isAdmin ? <AdminPage /> : <HomePage />;
      setRenderPage(page);
    }
  }, [user, loading]);

  if (loading || !renderPage) return <div>Carregando...</div>;

  return renderPage;
}

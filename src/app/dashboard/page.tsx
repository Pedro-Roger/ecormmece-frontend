"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore"; 

export default function DashboardPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const user = useAuthStore((state) => state.user);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">Dashboard</h1>

      <section className="flex items-center gap-6 mb-10 p-6 bg-white rounded shadow">
       
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500">
          {user?.image ? (
            <img src={user.image} alt="Foto do usuário" className="w-full h-full object-cover" />
          ) : (
            user?.email?.[0].toUpperCase() || "U"
          )}
        </div>

       
        <div>
          <p className="text-xl font-semibold">{user?.email || "Usuário não logado"}</p>
          <button
            onClick={() => alert("Funcionalidade de mudar senha ainda não implementada")}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Mudar senha
          </button>
        </div>
      </section>

      <section className="mb-8 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Resumo do Carrinho</h2>
        <p>
          Você tem <strong>{totalItems}</strong> item(ns) no carrinho.
        </p>
      </section>

      

      <button
        onClick={() => router.push("/")}
        className="mt-10 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Voltar para a loja
      </button>
    </div>
  );
}

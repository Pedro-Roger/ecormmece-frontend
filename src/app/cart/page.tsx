"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const items = useCartStore(state => state.items);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const removeItem = useCartStore(state => state.removeItem);
  const clearCart = useCartStore(state => state.clearCart);
  const total = useCartStore(state => state.getTotal());
  const router = useRouter();

  const formatPrice = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Carrinho</h1>

      {items.length === 0 ? (
        <div className="text-center text-gray-500">
          Seu carrinho está vazio.
          <div className="mt-4">
            <Link href="/" className="text-blue-500 hover:underline">
              Voltar à loja
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {items.map(item => (
              <div
                key={item.product.id}
                className="flex items-center justify-between bg-white shadow p-4 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  {item.product.image && (
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      className="rounded"
                    />
                  )}
                  <div>
                    <h2 className="font-semibold">{item.product.name}</h2>
                    <p className="text-gray-600">{formatPrice(item.product.price)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-red-500 hover:underline ml-4"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-between items-center">
            <h3 className="text-xl font-semibold">Total: {formatPrice(total)}</h3>
            <div className="flex gap-4">
              <button
                onClick={clearCart}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Limpar carrinho
              </button>
              <button
                onClick={() => router.push("/checkout")}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Finalizar pedido
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

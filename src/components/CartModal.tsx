"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const total = useCartStore.getState().getTotal(); // evitar execução fora do client

  const formatPrice = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
      ></div>

      <div className="fixed inset-y-10 right-10 w-96 bg-white rounded-lg shadow-lg p-6 z-50 overflow-auto max-h-[80vh]">
        <button
          onClick={onClose}
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          Fechar ×
        </button>

        <h2 className="text-2xl font-bold mb-4">Seu Carrinho</h2>

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
            <div className="space-y-4 max-h-[60vh] overflow-auto">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded"
                >
                  <div className="flex items-center gap-3">
                    {item.product.image && (
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        width={60}
                        height={60}
                        className="rounded"
                      />
                    )}
                    <div>
                      <p className="font-semibold">{item.product.name}</p>
                      <p className="text-gray-600">
                        {formatPrice(item.product.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-red-500 hover:underline ml-2"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Total: {formatPrice(total)}</h3>
              <div className="flex gap-2">
                <button
                  onClick={clearCart}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Limpar
                </button>
                <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">
                  Finalizar
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

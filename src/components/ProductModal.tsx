"use client";

import { Dialog } from "@headlessui/react";
import { X, Plus, Minus, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { Product } from "@/types";
import { Button } from "./ui/button";
import { useCartStore } from "@/store/cartStore";
import { toast } from "@/hooks/use-toast";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  useEffect(() => {
    if (!isOpen) setQuantity(1);
  }, [isOpen]);

  if (!product) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }

    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho.`,
    });

    onClose(); 
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white rounded-xl shadow-xl p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-black"
          >
            <X />
          </button>

          <img
            src={
              product.image ||
              "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop"
            }
            alt={product.name}
            className="w-full h-64 object-contain mb-4 rounded"
          />

          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="text-gray-600 mb-2">{product.description}</p>
          <p className="text-lg font-semibold text-green-700 mb-4">
            R$ {product.price.toFixed(2)}
          </p>

          <div className="flex items-center gap-2 mb-4">
            <Button
              size="icon"
              variant="outline"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus />
            </Button>
            <span className="text-lg">{quantity}</span>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus />
            </Button>
          </div>

          <Button
            onClick={handleAddToCart}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Adicionar ao carrinho
          </Button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

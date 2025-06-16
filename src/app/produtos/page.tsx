"use client";

import { useEffect, useState } from "react";
import { ProductModal } from "@/components/ProductModal";
import { Product } from "@/types";

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  function openModal(product: Product) {
    setSelectedProduct(product);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedProduct(null);
  }

  useEffect(() => {
    fetch("http://localhost:3001/product")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar produtos:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center py-10">Carregando produtos...</p>;

  return (
    <div className="min-h-screen bg-cyan-50">
      {/* Hero Section */}
      <section className="bg-sky-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Sua Loja Online
            <span className="block text-xl md:text-2xl font-normal mt-2 opacity-90">
              Visualização de usuário (admin)
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Veja como os usuários finais visualizam os produtos
          </p>
          <button
            className="bg-zinc-700 text-brand-600 hover:bg-gray-100 text-lg px-8 py-3 rounded"
            onClick={() =>
              document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Ver Produtos
          </button>
        </div>
      </section>

      {/* Produtos */}
      <section id="products" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nossos Produtos
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Visualização simulada da vitrine do usuário
            </p>
          </div>

          {products.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">Nenhum produto encontrado.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((produto) => (
                <div
                  key={produto.id}
                  onClick={() => openModal(produto)}
                  className="cursor-pointer bg-white border rounded-xl shadow-md p-4 hover:shadow-lg transition duration-200"
                >
                  <div className="h-48 bg-gray-100 rounded mb-4 flex items-center justify-center">
                    {produto.image ? (
                      <img
                        src={produto.image}
                        alt={produto.name}
                        className="h-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-400">Sem imagem</span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{produto.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{produto.description || "Sem descrição"}</p>
                  <p className="text-sky-800 font-bold text-lg">R$ {produto.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <ProductModal
        product={selectedProduct}
        isOpen={modalOpen}
        onClose={closeModal}
      />
    </div>
  );
}

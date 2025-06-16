"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductModal } from "@/components/ProductModal";
import { Product } from "@/types";
import { Search, Filter } from "lucide-react";

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState<"all" | "low" | "medium" | "high">("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ready, setReady] = useState(false);

  const { user, loading } = useAuthStore();
  const router = useRouter();

  
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (user.isAdmin) {
        router.replace("/admin");
      } else {
        setReady(true);
      }
    }
  }, [loading, user, router]);

  
  useEffect(() => {
    if (!ready) return;

    async function fetchProducts() {
      try {
        const res = await fetch("http://localhost:3001/product");
        if (!res.ok) throw new Error("Erro ao carregar produtos");
        const data: Product[] = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchProducts();
  }, [ready]);


  useEffect(() => {
    if (!ready) return;

    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priceFilter !== "all") {
      filtered = filtered.filter((product) => {
        switch (priceFilter) {
          case "low":
            return product.price < 1000;
          case "medium":
            return product.price >= 1000 && product.price < 5000;
          case "high":
            return product.price >= 5000;
          default:
            return true;
        }
      });
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, priceFilter, ready]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  if (!ready) {
   
    return null;
  }

  return (
    <div className="min-h-screen bg-cyan-50">
      <section className="bg-sky-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Sua Loja Online
            <span className="block text-xl md:text-2xl font-normal mt-2 opacity-90">
              Os melhores produtos com a melhor experiência
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Descubra produtos incríveis com qualidade garantida e entrega rápida
          </p>
          <Button
            size="lg"
            className="bg-zinc-700 text-brand-600 hover:bg-gray-100 text-lg px-8 py-3"
            onClick={() =>
              document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Ver Produtos
          </Button>
        </div>
      </section>

      <section id="products" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nossos Produtos
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Encontre exatamente o que você precisa em nossa seleção cuidadosamente curada
            </p>
          </div>

          <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-brand-500" />
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value as any)}
                className="appearance-none border border-gray-300 rounded-lg px-4 py-2 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent hover:border-brand-400 transition duration-200 ease-in-out shadow-sm"
              >
                <option value="all">Todos os preços</option>
                <option value="low">Até R$ 1.000</option>
                <option value="medium">R$ 1.000 - R$ 5.000</option>
                <option value="high">Acima de R$ 5.000</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => handleProductClick(product)}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-gray-600">
                Nenhum produto encontrado com os filtros aplicados.
              </p>
            </div>
          )}
        </div>
      </section>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
}

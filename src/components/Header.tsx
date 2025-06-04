// components/layout/Header.tsx (ou onde você preferir guardar seu Header)

"use client";

// Marca este componente como um Client Component
import { Button } from "@/components/ui/button";
// Assumindo que você tem um componente Button
import { useAuthStore } from "@/store/authStore";
// Assumindo que você tem seu authStore
import { useCartStore } from "@/store/cartStore";
// Assumindo que você tem seu cartStore
import { ShoppingCart, User, Menu, X, LogOut } from "lucide-react";
import Link from "next/link";
// Importa o Link do Next.js
import { useRouter } from "next/navigation";
// Importa useRouter do Next.js
import { useState } from "react";

export default function Header() {
  // Exportação padrão para uso em Next.js (ex: em um layout.tsx)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/"); // Redireciona para a página inicial após o logout
    setIsMenuOpen(false); // Fecha o menu mobile, se estiver aberto
  };

  const cartItemCount = getItemCount();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - ECommerce */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ECommerce</span>
          </Link>

          {/* Desktop Navigation - Produtos */}
          {/* Adicionei o "Produtos" aqui conforme a imagem, com um pouco mais de espaçamento para centralizar */}
          <nav className="hidden md:flex flex-grow justify-start pl-16">
            {" "}
            {/* Ajuste aqui para posicionar "Produtos" */}
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 transition-colors text-base font-medium"
            >
              Produtos
            </Link>
          </nav>

          {/* Actions - Carrinho, Entrar/Cadastrar/Sair */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
              aria-label="Carrinho de Compras"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Actions (Desktop) */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm text-gray-700 hidden lg:inline">
                  Olá, {user?.name}
                </span>
                <Link
                  href={user?.isAdmin ? "/admin" : "/dashboard"}
                  className="hidden lg:inline-flex text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-1" /> Minha Conta
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-blue-600"
                >
                  <LogOut className="h-4 w-4 mr-1" /> Sair
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Entrar
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Cadastrar
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4 px-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 transition-colors text-base py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Produtos
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    href={user?.isAdmin ? "/admin" : "/dashboard"}
                    className="text-gray-700 hover:text-blue-600 transition-colors text-base py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {user?.isAdmin ? "Admin" : "Minha Conta"}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-gray-700 hover:text-blue-600 transition-colors text-base py-2 w-full"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-blue-600 transition-colors text-base py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/register"
                    className="text-gray-700 hover:text-blue-600 transition-colors text-base py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cadastrar
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

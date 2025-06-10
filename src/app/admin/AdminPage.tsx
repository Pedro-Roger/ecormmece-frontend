"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Package, Users, ShoppingCart, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Product } from "@/types";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/hooks/use-toast";

const API_BASE_URL = "http://localhost:3001/product";

export const AdminPage = () => {
  const router = useRouter();
  const { user } = useAuthStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });

  // Redirecionar se não for admin ou não estiver logado
  useEffect(() => {
    if (!user || !user.isAdmin) {
      router.push("/login");
    }
  }, [user, router]);

  const resetForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      image: "",
    });
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
      const data: Product[] = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      toast({
        title: "Erro ao carregar produtos.",
        description: "Não foi possível carregar os produtos do servidor.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user?.token}`,
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          name: productForm.name,
          description: productForm.description,
          price: parseFloat(productForm.price),
          image:
            productForm.image ||
            "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro HTTP! Status: ${response.status}`);
      }

      const newProduct: Product = await response.json();
      setProducts([...products, newProduct]);

      resetForm();
      setIsCreateModalOpen(false);

      toast({
        title: "Produto criado!",
        description: `${newProduct.name} foi adicionado com sucesso.`,
      });
    } catch (error: any) {
      console.error("Erro ao criar produto:", error);
      toast({
        title: "Erro ao criar produto.",
        description: error.message || "Não foi possível criar o produto.",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingProduct) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${editingProduct.id}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({
          name: productForm.name,
          description: productForm.description,
          price: parseFloat(productForm.price),
          image: productForm.image || editingProduct.image,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro HTTP! Status: ${response.status}`);
      }

      const updatedProduct: Product = await response.json();
      setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));

      resetForm();
      setIsEditModalOpen(false);
      setEditingProduct(null);

      toast({
        title: "Produto atualizado!",
        description: `${updatedProduct.name} foi atualizado com sucesso.`,
      });
    } catch (error: any) {
      console.error("Erro ao atualizar produto:", error);
      toast({
        title: "Erro ao atualizar produto.",
        description: error.message || "Não foi possível atualizar o produto.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${productId}`, {
        method: "DELETE",
        headers: authHeaders,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro HTTP! Status: ${response.status}`);
      }

      setProducts(products.filter((p) => p.id !== productId));

      toast({
        title: "Produto removido!",
        description: `${productName} foi removido com sucesso.`,
      });
    } catch (error: any) {
      console.error("Erro ao remover produto:", error);
      toast({
        title: "Erro ao remover produto.",
        description: error.message || "Não foi possível remover o produto.",
        variant: "destructive",
      });
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
    });
    setIsEditModalOpen(true);
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const stats = {
    totalProducts: products.length,
    totalUsers: 156,
    totalOrders: 89,
    revenue: 125890.5,
  };

  if (!user || !user.isAdmin) {
    return null; // ou spinner, enquanto redireciona
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Admin</h1>
          <p className="text-gray-600">Bem-vindo(a), {user.name}! Gerencie sua loja.</p>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">Total de produtos</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Usuários registrados</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">Total de pedidos</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {stats.revenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">Receita total</p>
            </CardContent>
          </Card>
        </div>

        {/* Gestão de produtos */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Produtos
              </CardTitle>
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="default" size="sm" onClick={openCreateModal}>
                    <Plus className="mr-2 h-4 w-4" /> Novo produto
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Adicionar produto</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateProduct} className="space-y-4">
                    <Input
                      placeholder="Nome"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    />
                    <Textarea
                      placeholder="Descrição"
                      required
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    />
                    <Input
                      placeholder="Preço"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    />
                    <Input
                      placeholder="URL da imagem (opcional)"
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    />
                    <Button type="submit" className="w-full">
                      Criar
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">Imagem</th>
                  <th className="border border-gray-300 px-4 py-2">Nome</th>
                  <th className="border border-gray-300 px-4 py-2">Descrição</th>
                  <th className="border border-gray-300 px-4 py-2">Preço</th>
                  <th className="border border-gray-300 px-4 py-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border border-gray-300 hover:bg-gray-50">
                    <td className="border border-gray-300 px-2 py-1">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{product.description}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      R$ {product.price.toFixed(2).replace(".", ",")}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(product)}
                        title="Editar produto"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                        title="Excluir produto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">
                      Nenhum produto encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Modal Editar Produto */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar produto</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditProduct} className="space-y-4">
              <Input
                placeholder="Nome"
                required
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              />
              <Textarea
                placeholder="Descrição"
                required
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              />
              <Input
                placeholder="Preço"
                type="number"
                min="0"
                step="0.01"
                required
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
              />
              <Input
                placeholder="URL da imagem (opcional)"
                value={productForm.image}
                onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
              />
              <Button type="submit" className="w-full">
                Salvar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

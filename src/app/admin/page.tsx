"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/types";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/hooks/use-toast";

const API_BASE_URL =
  `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/product`;

export const AdminPage = () => {
  const router = useRouter();
  
  const { user, token, loading } = useAuthStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    stock: "",
  });

  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null);

  
  useEffect(() => {
    
    if (!loading && !user?.isAdmin) {
     
      router.replace("/login");
    }
  }, [loading, user, router]);

  
  useEffect(() => {
    if (!loading && user?.isAdmin) {
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
      fetchProducts();
    }
  }, [loading, user]); 

  const resetForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      image: "",
      stock: "",
    });
  };
  
  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, 
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingCreate(true);
    
    const priceNumber = parseFloat(productForm.price);
    const stockNumber = parseInt(productForm.stock);
    
    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          name: productForm.name.trim(),
          description: productForm.description.trim(),
          price: priceNumber,
          stock: stockNumber,
          image:
            productForm.image.trim() ||
            "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Erro HTTP! Status: ${response.status}`
        );
      }
      const newProduct: Product = await response.json();
      setProducts((prev) => [...prev, newProduct]);
      resetForm();
      setIsCreateModalOpen(false);
      toast({
        title: "Produto criado!",
        description: `${newProduct.name} foi adicionado com sucesso.`,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao criar produto.",
        description: error.message || "Não foi possível criar o produto.",
        variant: "destructive",
      });
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setLoadingEdit(true);

    const priceNumber = parseFloat(productForm.price);
    const stockNumber = parseInt(productForm.stock);

    try {
      const response = await fetch(`${API_BASE_URL}/${editingProduct.id}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({
          name: productForm.name.trim(),
          description: productForm.description.trim(),
          price: priceNumber,
          stock: stockNumber,
          image: productForm.image.trim() || editingProduct.image,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Erro HTTP! Status: ${response.status}`
        );
      }
      const updatedProduct: Product = await response.json();
      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
      resetForm();
      setIsEditModalOpen(false);
      setEditingProduct(null);
      toast({
        title: "Produto atualizado!",
        description: `${updatedProduct.name} foi atualizado com sucesso.`,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar produto.",
        description: error.message || "Não foi possível atualizar o produto.",
        variant: "destructive",
      });
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Tem certeza que deseja excluir o produto "${productName}"?`))
      return;

    setLoadingDeleteId(productId);
    try {
      const response = await fetch(`${API_BASE_URL}/${productId}`, {
        method: "DELETE",
        headers: authHeaders,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Erro HTTP! Status: ${response.status}`
        );
      }
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      toast({
        title: "Produto removido!",
        description: `${productName} foi removido com sucesso.`,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao remover produto.",
        description: error.message || "Não foi possível remover o produto.",
        variant: "destructive",
      });
    } finally {
      setLoadingDeleteId(null);
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
      stock: product.stock?.toString() || "0",
    });
    setIsEditModalOpen(true);
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const stats = {
    totalProducts: products.length,
    totalUsers: 156, // Dados mockados
    totalOrders: 89, // Dados mockados
    revenue: 125890.5, // Dados mockados
  };

  
  if (loading || !user?.isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center">
        
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                R$ {stats.revenue.toFixed(2).replace(".", ",")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Botão criar */}
        <div className="mb-4 flex justify-end">
          <Button onClick={openCreateModal} variant="default" size="sm">
            <Plus className="mr-2 h-4 w-4" /> Novo Produto
          </Button>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <img
                src={product.image}
                alt={product.name}
                className="h-48 w-full object-cover rounded-t-md"
              />
              <CardContent className="flex-grow p-4">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                <p className="mt-2 font-bold">R$ {product.price.toFixed(2).replace(".", ",")}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Estoque: {product.stock ?? 0}
                </p>
              </CardContent>
              <div className="flex justify-end space-x-2 p-4 pt-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditModal(product)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteProduct(product.id, product.name)}
                  disabled={loadingDeleteId === product.id}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Modal Criar Produto */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Produto</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <Input
                placeholder="Nome"
                value={productForm.name}
                onChange={(e) =>
                  setProductForm((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
              <Textarea
                placeholder="Descrição"
                value={productForm.description}
                onChange={(e) =>
                  setProductForm((prev) => ({ ...prev, description: e.target.value }))
                }
                required
              />
              <Input
                type="number"
                min={0.01}
                step={0.01}
                placeholder="Preço (ex: 29.99)"
                value={productForm.price}
                onChange={(e) =>
                  setProductForm((prev) => ({ ...prev, price: e.target.value }))
                }
                required
              />
              <Input
                type="number"
                min={0}
                step={1}
                placeholder="Estoque (ex: 10)"
                value={productForm.stock}
                onChange={(e) =>
                  setProductForm((prev) => ({ ...prev, stock: e.target.value }))
                }
                required
              />
              <Input
                placeholder="URL da imagem"
                value={productForm.image}
                onChange={(e) =>
                  setProductForm((prev) => ({ ...prev, image: e.target.value }))
                }
              />
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={loadingCreate}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loadingCreate}>
                  {loadingCreate ? "Criando..." : "Criar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Produto</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditProduct} className="space-y-4">
              <Input
                placeholder="Nome"
                value={productForm.name}
                onChange={(e) =>
                  setProductForm((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
              <Textarea
                placeholder="Descrição"
                value={productForm.description}
                onChange={(e) =>
                  setProductForm((prev) => ({ ...prev, description: e.target.value }))
                }
                required
              />
              <Input
                type="number"
                min={0.01}
                step={0.01}
                placeholder="Preço (ex: 29.99)"
                value={productForm.price}
                onChange={(e) =>
                  setProductForm((prev) => ({ ...prev, price: e.target.value }))
                }
                required
              />
              <Input
                type="number"
                min={0}
                step={1}
                placeholder="Estoque (ex: 10)"
                value={productForm.stock}
                onChange={(e) =>
                  setProductForm((prev) => ({ ...prev, stock: e.target.value }))
                }
                required
              />
              <Input
                placeholder="URL da imagem"
                value={productForm.image}
                onChange={(e) =>
                  setProductForm((prev) => ({ ...prev, image: e.target.value }))
                }
              />
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingProduct(null);
                  }}
                  disabled={loadingEdit}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loadingEdit}>
                  {loadingEdit ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <section className="py-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl font-bold mb-4">Pedidos realizados</h2>
    <p className="mb-8 text-gray-600">
      Visualização de pedidos realizados por usuários.
    </p>

    

  </div>
</section>
    </div>
  );
};

export default AdminPage;
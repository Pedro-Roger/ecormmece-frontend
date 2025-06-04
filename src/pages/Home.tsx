
import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types';
import { useNavigate } from 'react-router-dom';

// Mock data para demonstração
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'MacBook Pro 16"',
    description: 'Laptop profissional com chip M2 Pro, 16GB RAM e 512GB SSD',
    price: 12999.99,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
    category: 'Eletrônicos'
  },
  {
    id: '2',
    name: 'iPhone 15 Pro',
    description: 'Smartphone premium com câmera profissional e chip A17 Pro',
    price: 8999.99,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
    category: 'Eletrônicos'
  },
  {
    id: '3',
    name: 'Cadeira Ergonômica',
    description: 'Cadeira de escritório premium com suporte lombar ajustável',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    category: 'Móveis'
  },
  {
    id: '4',
    name: 'Fones Bluetooth Premium',
    description: 'Fones over-ear com cancelamento ativo de ruído',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    category: 'Eletrônicos'
  },
  {
    id: '5',
    name: 'Mesa Gamer RGB',
    description: 'Mesa para setup gamer com iluminação RGB personalizável',
    price: 799.99,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
    category: 'Móveis'
  },
  {
    id: '6',
    name: 'Monitor 4K 27"',
    description: 'Monitor profissional com resolução 4K e calibração de cor',
    price: 2199.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
    category: 'Eletrônicos'
  }
];

export const Home = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    let filtered = products;

    // Filtro por nome
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por preço
    if (priceFilter !== 'all') {
      filtered = filtered.filter(product => {
        switch (priceFilter) {
          case 'low':
            return product.price < 1000;
          case 'medium':
            return product.price >= 1000 && product.price < 5000;
          case 'high':
            return product.price >= 5000;
          default:
            return true;
        }
      });
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, priceFilter]);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-brand text-white py-20">
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
            className="bg-white text-brand-600 hover:bg-gray-100 text-lg px-8 py-3"
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Ver Produtos
          </Button>
        </div>
      </section>

      {/* Products Section */}
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

          {/* Filters */}
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
              <Filter className="h-4 w-4 text-gray-600" />
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value as any)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="all">Todos os preços</option>
                <option value="low">Até R$ 1.000</option>
                <option value="medium">R$ 1.000 - R$ 5.000</option>
                <option value="high">Acima de R$ 5.000</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => handleProductClick(product.id)}
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
    </div>
  );
};

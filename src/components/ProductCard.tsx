import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { toast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    addItem(product);
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho.`,
    });
  };

  return (
    <Card
      onClick={onClick}
      className="group relative cursor-pointer transition-all duration-300 hover:shadow-lg border-0 shadow-sm bg-white"
    >
      <CardContent className="p-0">
        <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-100 relative">
          <img
            src={
              product.image ||
              "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop"
            }
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="text-xl font-bold text-brand-600">
            R$ {product.price.toFixed(2)}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
  <Button
    onClick={(e) => {
      e.stopPropagation();
      onClick?.(); 
    }}
    className="w-full bg-brand-600 text-white hover:bg-brand-700 transition-colors"
    size="sm"
  >
    Ver mais
  </Button>
</CardFooter>
    </Card>
  );
};

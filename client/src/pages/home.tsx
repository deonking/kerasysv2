import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, QrCode, Receipt, Flame } from "lucide-react";
import type { Product } from "@shared/schema";

export default function Home() {
  const { data: allProductsData, isLoading } = useQuery({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const response = await fetch("/api/products?limit=100");
      return response.json();
    },
  });

  const { data: kitsData } = useQuery({
    queryKey: ["/api/products", "kits-promocionais"],
    queryFn: async () => {
      const response = await fetch("/api/products?category=kits-promocionais&limit=20");
      return response.json();
    },
  });

  const products = allProductsData?.products || [];
  const kits = kitsData?.products || [];

  const featuredProduct = products.find(p => p.productId === "featured-propolis");
  const bestSellers = products.slice(0, 8);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        {/* Hero Skeleton */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <Skeleton className="h-16 w-96 mx-auto mb-6" />
              <Skeleton className="h-6 w-64 mx-auto mb-8" />
              <Skeleton className="h-12 w-48 mx-auto" />
            </div>
          </div>
        </div>

        {/* Products Skeleton */}
        <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {Array(10).fill(0).map((_, i) => (
              <Card key={i} className="w-full max-w-sm mx-auto">
                <CardContent className="p-0">
                  <Skeleton className="w-full h-40 sm:h-48 rounded-t-lg" />
                  <div className="p-3 sm:p-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="bg-white py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center">
            <Link href="/categoria/kits-promocionais">
              <img 
                src="https://xn--kersys-kta.com/wp-content/uploads/2025/04/COMPRA-AGORA.png" 
                alt="Compra Agora" 
                className="mx-auto max-w-xs sm:max-w-sm w-full hover:opacity-90 transition-opacity cursor-pointer"
              />
            </Link>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
        {/* Best Sellers */}
        <section className="mb-12 sm:mb-16">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-black text-center">Mais vendidos</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Kits Section */}
        <section className="mb-12 sm:mb-16">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-black text-center">Kits e combos promocionais</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {kits.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Category Sections */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-black text-center">Shampoo</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {products.filter(p => p.category === 'shampoo').slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="text-center mb-8">
            <img 
              src="https://xn--kersys-kta.com/wp-content/uploads/2025/04/COMPRA-AGORA-1-665x800.png" 
              alt="Compra Agora" 
              className="mx-auto max-w-xs"
            />
          </div>
        </section>

        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-black text-center">Condicionador</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {products.filter(p => p.category === 'condicionador').slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

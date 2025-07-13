import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";
import kerasysLogo from "@assets/image_1752358528146.png";

export function Header() {
  const { itemCount, toggleCart } = useCart();
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <>
      {/* Top Bar - Hidden on mobile to save space */}
      <div className="hidden sm:block bg-black text-white text-xs py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4 lg:space-x-6 text-xs">
              <span className="hidden lg:inline">CENTRAL DE ATENDIMENTO</span>
              <span>Entre/Cadastrar</span>
              <span className="hidden md:inline">Onde está meu produto?</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="hidden lg:inline">ATACADO</span>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-6 w-6 text-white hover:bg-white/10"
                onClick={toggleCart}
              >
                <ShoppingCart className="h-4 w-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                    {itemCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <img
                src={kerasysLogo}
                alt="Kerasys"
                className="h-8 sm:h-10 lg:h-12 w-auto"
              />
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Pesquisar produtos"
                  className="w-full pr-10 h-10 border-gray-300"
                />
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile Search Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-8 w-8 sm:h-10 sm:w-10"
                onClick={() => setShowMobileSearch(!showMobileSearch)}
              >
                {showMobileSearch ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Search className="h-4 w-4 sm:h-5 sm:w-5" />}
              </Button>

              {/* Account Info - Hidden on small mobile */}
              <div className="hidden md:flex flex-col text-xs text-gray-600">
                <span>Minha conta</span>
                <span className="font-semibold">Registrar/ Pedidos</span>
              </div>

              {/* Cart Button */}
              <Button
                variant="ghost"
                size="icon"
                className="relative h-8 w-8 sm:h-10 sm:w-10"
                onClick={toggleCart}
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-[10px] sm:text-xs">
                    {itemCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {showMobileSearch && (
            <div className="lg:hidden pb-4 border-t border-gray-200 pt-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Pesquisar produtos"
                  className="w-full pr-10 h-10 border-gray-300"
                  autoFocus
                />
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

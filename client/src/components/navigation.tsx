import { Link, useLocation } from "wouter";
import { ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const categories = [
  { name: "SHAMPOO", href: "/categoria/shampoo" },
  { name: "CONDICIONADOR", href: "/categoria/condicionador" },
  { name: "TRATAMENTO", href: "/categoria/tratamento" },
  { name: "KITS PROMOCIONAIS", href: "/categoria/kits-promocionais" },
];

export function Navigation() {
  const [location] = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-center h-14">
          <div className="flex space-x-8 lg:space-x-16">
            {categories.map((category) => {
              const isActive = location === category.href;
              return (
                <Link
                  key={category.href}
                  href={category.href}
                  className={`text-sm font-semibold tracking-wide transition-colors uppercase whitespace-nowrap ${
                    isActive
                      ? "text-black border-b-2 border-black pb-4"
                      : "text-gray-600 hover:text-black pb-4"
                  }`}
                >
                  {category.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="flex items-center justify-between h-12">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-sm font-semibold uppercase"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="h-4 w-4" />
              <span>CATEGORIAS</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showMobileMenu ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          {/* Mobile Dropdown Menu */}
          {showMobileMenu && (
            <div className="border-t border-gray-200 bg-white shadow-lg">
              <div className="py-2">
                {categories.map((category) => {
                  const isActive = location === category.href;
                  return (
                    <Link
                      key={category.href}
                      href={category.href}
                      className={`block px-4 py-3 text-sm font-semibold tracking-wide transition-colors uppercase ${
                        isActive
                          ? "text-black bg-gray-50 border-l-4 border-black"
                          : "text-gray-600 hover:text-black hover:bg-gray-50"
                      }`}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      {category.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

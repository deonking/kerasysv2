import type { Product, InsertProduct, CartItem, CartItemWithProduct } from "@shared/schema";

export interface IStorage {
  // Products
  getAllProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Cart
  getCartItems(sessionId: string): Promise<CartItemWithProduct[]>;
  addToCart(sessionId: string, productId: string, quantity: number): Promise<CartItem>;
  updateCartItemQuantity(sessionId: string, productId: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(sessionId: string, productId: string): Promise<boolean>;
  clearCart(sessionId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product> = new Map();
  private cartItems: Map<string, CartItem[]> = new Map();
  private currentProductId: number = 1;
  private currentCartId: number = 1;

  constructor() {
    this.seedProducts();
  }

  private seedProducts() {
    const productsData: InsertProduct[] = [
      // Kits Promocionais - Authentic products from official Kerasys website
      {
        name: "Kerasys Kit Argan Oil Nutrição Shampoo + Condicionador",
        description: "Kit completo com shampoo e condicionador enriquecidos com óleo de argan para nutrição profunda dos cabelos. Ideal para cabelos secos e danificados que precisam de hidratação e reparação.",
        category: "kits-promocionais",
        originalPrice: "299.90",
        salePrice: "199.90",
        discountPercentage: 33,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/863f793f-b88c-402f-ae5c-fa22ba87072b-2025-01-14t163142132796585-kekitaroishco-65d364ccc4936428e5550c10-99758df3-633c-4982-a0d7-e2b5235bee1d_1-1.jpg",
        volume: "Kit completo",
        productId: "kit_argan_oil_nutricao",
      },
      {
        name: "Kerasys Kit Duo Coconut Profissional Shampoo + Condicionador 1litro",
        description: "Kit profissional com shampoo e condicionador de coco para nutrição intensa. Fórmula com óleo de coco puro que restaura a vitalidade dos cabelos danificados e ressecados.",
        category: "kits-promocionais",
        originalPrice: "299.90",
        salePrice: "145.90",
        discountPercentage: 51,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/9bc69cfb-13fa-43f9-bbad-3d5169b09313-2024-12-13t151856822218456-kitkeduoconut-65d364ccc4936428e5550c10-d689d7ec-3531-4473-af54-c10cd5324979_1-1.jpg",
        volume: "1L cada",
        productId: "kit_duo_coconut_profissional",
      },
      {
        name: "KERASYS PROPOLIS SHAMPOO ENERGY 180 ML + CONDICIONADOR SHINE 180 ML",
        description: "Kit com shampoo energizante e condicionador de brilho com própolis. Fórmula que fortalece, protege e adiciona brilho natural aos cabelos, criando uma película protetora contra danos externos.",
        category: "kits-promocionais",
        originalPrice: "89.90",
        salePrice: "69.90",
        discountPercentage: 22,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/4e56c161-7b10-4422-93b1-a7dc63cc8204-2024-10-10t114222632502768-kereshk20360-66ce14b94b567678abe903d7-5ea4ae15-dd78-4d49-9340-69bb08e65b5c-1.jpg",
        volume: "180ml cada",
        productId: "kit_propolis_energy_shine",
      },
      {
        name: "Kerasys Revitalizing Duo Salão (2 Produtos)",
        description: "Kit profissional da linha Revitalizing para tratamento em salão. Combina shampoo e condicionador para revitalização completa de cabelos fragilizados e sem vida.",
        category: "kits-promocionais",
        originalPrice: "299.00",
        salePrice: "195.90",
        discountPercentage: 34,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/kerasys-revitalizing-duo-salao-2-produtos-54940-2466884936377254145_1-1.jpg",
        volume: "Kit profissional",
        productId: "revitalizing_duo_salao",
      },

      // Shampoos - Authentic products from official Kerasys website
      {
        name: "Kerasys Advanced Keramide Ampoule Damage Clinic – Shampoo 1L",
        description: "Shampoo profissional com ampola de ceramidas para cabelos extremamente danificados. Tecnologia avançada que reconstrói a estrutura capilar e previne quebra.",
        category: "shampoo",
        originalPrice: "139.90",
        salePrice: "98.90",
        discountPercentage: 29,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/b9693156-96d1-497c-89e9-3d816c782160-2024-12-27t174409978034878-kekeamdaclsh-65d364ccc4936428e5550c10-626e36a9-4b36-4e93-9bb8-0de860d19eb5-1.jpg",
        volume: "1L",
        productId: "advanced_keramide_shampoo_1l",
      },
      {
        name: "Kerasys Moisturizing – Shampoo 180ml",
        description: "Shampoo hidratante para uso diário em cabelos secos e ressecados. Fórmula suave que limpa sem resseca, mantendo a hidratação natural dos fios.",
        category: "shampoo",
        originalPrice: "39.90",
        salePrice: "29.90",
        discountPercentage: 25,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/kerasys-moisturizing-shampoo-180g-54651-1544130672648633265_1-1.jpg",
        volume: "180ml",
        productId: "moisturizing_shampoo_180ml",
      },
      {
        name: "Kerasys Oriental Premium – Shampoo 600ml",
        description: "Shampoo Oriental Premium em tamanho econômico com fragrância duradoura. Tecnologia asiática avançada para cabelos com brilho e maciez orientais.",
        category: "shampoo",
        originalPrice: "99.90",
        salePrice: "69.90",
        discountPercentage: 30,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/kerasys-oriental-premium-shampoo-600g-54660-8673332746674290130_1-1.jpg",
        volume: "600ml",
        productId: "oriental_premium_shampoo_600ml",
      },
      {
        name: "Kerasys Repairing – Shampoo 180ml",
        description: "Shampoo reparador para cabelos danificados e fragilizados. Fórmula com proteínas que reconstrói a estrutura capilar e fortalece os fios quebrados.",
        category: "shampoo",
        originalPrice: "62.00",
        salePrice: "36.89",
        discountPercentage: 41,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/1319fd64-1fe1-4f17-b27e-eff82cfbe3fa-kerasys-repairing-shampoo-180ml_1-1.png",
        volume: "180ml",
        productId: "repairing_shampoo_180ml",
      },
      {
        name: "Kerasys Tea Tree Oil – Shampoo 1L",
        description: "Shampoo purificante com óleo de tea tree para couro cabeludo oleoso e com caspa. Fórmula antisséptica que limpa profundamente e equilibra a oleosidade.",
        category: "shampoo",
        originalPrice: "189.90",
        salePrice: "119.90",
        discountPercentage: 37,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/24b14a27-b5cb-4191-a1cf-37c3808300bd-2025-01-07t124725799433847-kenaretetrsh-65d364ccc4936428e5550c10-f7a9dc6c-1845-4438-8271-4b6c4d58c8e6-1.jpg",
        volume: "1L",
        productId: "tea_tree_oil_shampoo_1l",
      },

      // Condicionadores - Authentic products from official Kerasys website
      {
        name: "Kerasys Advanced Color Protect – Condicionador 400ml",
        description: "Condicionador protetor de cor para cabelos coloridos e com luzes. Fórmula que sela a cor, previne desbotamento e mantém o brilho vibrante por mais tempo.",
        category: "condicionador",
        originalPrice: "105.90",
        salePrice: "65.00",
        discountPercentage: 39,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/cae207ef-7e62-4a7d-a583-625728aa2716-mp146002-condicionador-kerasys-advanced-color-protect-400ml_1-1.png",
        volume: "400ml",
        productId: "advanced_color_protect_condicionador_400ml",
      },
      {
        name: "Kerasys Argan Oil – Condicionador 1L",
        description: "Condicionador nutritivo com óleo de argan para hidratação profunda. Rico em vitamina E e ácidos graxos essenciais que restauram maciez e brilho natural.",
        category: "condicionador",
        originalPrice: "119.90",
        salePrice: "89.90",
        discountPercentage: 25,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/9fdcc98f-ea1f-463f-96c4-c729d4c4fd9e-2024-10-09t111532073084114-kerarg021000-66ce14b94b567678abe903d7-95a57a73-2399-4618-b0ea-36096daec229_1-1.jpg",
        volume: "1L",
        productId: "argan_oil_condicionador_1l",
      },
      {
        name: "Kerasys Moisturizing – Condicionador 180ml",
        description: "Condicionador hidratante para uso diário em cabelos secos. Fórmula leve que condiciona sem pesar, ideal para cabelos finos que precisam de hidratação.",
        category: "condicionador",
        originalPrice: "45.00",
        salePrice: "35.90",
        discountPercentage: 20,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/e91b71e3-a307-4d7e-bd65-6f0e88a19f4e-kerasys-moisturizing-condicionador-180ml_1-1.png",
        volume: "180ml",
        productId: "moisturizing_condicionador_180ml",
      },

      // Tratamentos - Authentic products from official Kerasys website
      {
        name: "Kerasys Advanced Keramide Ampoule Damage Clinic – Máscara Capilar 1L",
        description: "Máscara intensiva com ampola de ceramidas para cabelos extremamente danificados. Tratamento profissional que reconstrói completamente a estrutura capilar.",
        category: "tratamento",
        originalPrice: "199.90",
        salePrice: "136.89",
        discountPercentage: 32,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/e7f05be2-3a41-48b5-bec9-c6eaa2714d49-2025-01-06t175701078717335-keramaketrdm-65d364ccc4936428e5550c10-b916948c-632d-45db-98f2-b73ee9f92df4-1.jpg",
        volume: "1L",
        productId: "advanced_keramide_mascara_1l",
      },
      {
        name: "Kerasys Argan Oil – Máscara Capilar 1L",
        description: "Máscara nutritiva com óleo de argan para reparação profunda. Rico em antioxidantes e vitamina E, ideal para cabelos secos e danificados que precisam de nutrição intensa.",
        category: "tratamento",
        originalPrice: "199.90",
        salePrice: "139.90",
        discountPercentage: 30,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/7a344dca-890a-49a1-a709-b032ed332e65-mp275637-mascara-kerasys-argan-oil-treatment-1l-1.png",
        volume: "1L",
        productId: "argan_oil_mascara_1l",
      },
      {
        name: "Sérum Kerasys Advanced Ampoule Moisture 80ml",
        description: "Sérum concentrado com ampola de hidratação para cabelos ressecados. Tratamento leave-in que oferece hidratação imediata e proteção térmica.",
        category: "tratamento",
        originalPrice: "112.87",
        salePrice: "59.90",
        discountPercentage: 47,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/01c9392c-5b96-479a-8f33-8eccf55c6d2e-2023-11-03t092641753116371-serum-kerasys-advanced-ampoule-moisture-80mljpg8499581906475722834-1.jpg",
        volume: "80ml",
        productId: "serum_advanced_ampoule_moisture_80ml",
      },
    ];

    productsData.forEach((product) => {
      const fullProduct: Product = {
        id: this.currentProductId.toString(),
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.products.set(fullProduct.id, fullProduct);
      this.currentProductId++;
    });
  }

  // Product CRUD operations
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.category === category);
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const fullProduct: Product = {
      id: this.currentProductId.toString(),
      ...product,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.products.set(fullProduct.id, fullProduct);
    this.currentProductId++;
    return fullProduct;
  }

  // Cart operations
  async getCartItems(sessionId: string): Promise<CartItemWithProduct[]> {
    const items = this.cartItems.get(sessionId) || [];
    return items.map(item => ({
      ...item,
      product: this.products.get(item.productId)!
    }));
  }

  async addToCart(sessionId: string, productId: string, quantity: number): Promise<CartItem> {
    const sessionItems = this.cartItems.get(sessionId) || [];
    const existingItem = sessionItems.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
      return existingItem;
    } else {
      const newItem: CartItem = {
        id: this.currentCartId.toString(),
        sessionId,
        productId,
        quantity,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      sessionItems.push(newItem);
      this.cartItems.set(sessionId, sessionItems);
      this.currentCartId++;
      return newItem;
    }
  }

  async updateCartItemQuantity(sessionId: string, productId: string, quantity: number): Promise<CartItem | undefined> {
    const sessionItems = this.cartItems.get(sessionId) || [];
    const item = sessionItems.find(item => item.productId === productId);
    
    if (item) {
      item.quantity = quantity;
      item.updatedAt = new Date().toISOString();
      return item;
    }
    
    return undefined;
  }

  async removeFromCart(sessionId: string, productId: string): Promise<boolean> {
    const sessionItems = this.cartItems.get(sessionId) || [];
    const index = sessionItems.findIndex(item => item.productId === productId);
    
    if (index !== -1) {
      sessionItems.splice(index, 1);
      this.cartItems.set(sessionId, sessionItems);
      return true;
    }
    
    return false;
  }

  async clearCart(sessionId: string): Promise<void> {
    this.cartItems.set(sessionId, []);
  }
}

export const storage = new MemStorage();
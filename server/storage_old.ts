import { products, cartItems, type Product, type InsertProduct, type CartItem, type InsertCartItem, type CartItemWithProduct } from "@shared/schema";

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
      // Kits Promocionais
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
      {
        name: "Kit Kerasys Moisturizing Shampoo 180ml + Condicionador 180ml",
        description: "Kit hidratante com shampoo e condicionador da linha Moisturizing. Ideal para cabelos secos que precisam de hidratação diária sem pesar nos fios.",
        category: "kits-promocionais",
        originalPrice: "89.90",
        salePrice: "69.90",
        discountPercentage: 22,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/6a1b6ed3-fecf-458c-8a5f-681cac6c8b9d-kermoistsha180cond180-64b02e65de042b0d7485e1f9-46f9a1f0-1d86-40c5-bed0-ac814cf28cd7_1-1.jpg",
        volume: "180ml cada",
        productId: "kit_moisturizing_180ml",
      },
      {
        name: "Kit Kerasys Oriental Premium Shampoo 200ml + Condicionador 200ml",
        description: "Kit da linha Oriental Premium com fragrância oriental sofisticada. Combina tradição asiática com tecnologia moderna para cabelos com brilho e maciez.",
        category: "kits-promocionais",
        originalPrice: "89.90",
        salePrice: "69.90",
        discountPercentage: 22,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/0714353a-0db5-41f1-b13b-1e0dbdf4b841-8761-kerorientalsha200cond200-62fabdfea5a3c917225fd088-1491fb08-d425-445c-b1b6-fd5dbec3a49d-1.jpg",
        volume: "200ml cada",
        productId: "kit_oriental_premium_200ml",
      },
      {
        name: "Kit Kerasys Oriental Premium Shampoo 600ml + Condicionador 600ml",
        description: "Kit econômico da linha Oriental Premium em tamanho família. Tratamento completo com fragrância oriental e nutrição profunda para uso prolongado.",
        category: "kits-promocionais",
        originalPrice: "197.00",
        salePrice: "117.90",
        discountPercentage: 40,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/ebe2637e-aa09-4da3-ae78-37aec640bef1-8761-kerorientalshacon600-62fabdfea5a3c917225fd088-d27247f4-f3be-45bb-95ad-34e38a77122b_1-1.jpg",
        volume: "600ml cada",
        productId: "kit_oriental_premium_600ml",
      },
      {
        name: "Kit Kerasys Propolis Energy Shampoo 180ml + Tratamento de Brilho 180ml",
        description: "Kit energizante com própolis para fortalecer e dar brilho. Combina limpeza energética com tratamento intensivo para cabelos opacos e sem vitalidade.",
        category: "kits-promocionais",
        originalPrice: "117.90",
        salePrice: "65.95",
        discountPercentage: 44,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/bf7ddd65-234b-4352-b3ee-e98bfe7b8a58-2025-02-17t165554316547579-kerprosha180con180-64b02e65de042b0d7485e1f9-63310363-2dd9-4c8b-9726-0455df03dd5a-1.jpg",
        volume: "180ml cada",
        productId: "kit_propolis_energy_tratamento",
      },
      {
        name: "Kit Kerasys Propolis Energy Shampoo 1L + Tratamento de Brilho 1L",
        description: "Kit profissional tamanho salão com própolis para fortalecimento e brilho intenso. Ideal para uso profissional ou familiar com excelente custo-benefício.",
        category: "kits-promocionais",
        originalPrice: "255.90",
        salePrice: "149.90",
        discountPercentage: 41,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/1671ac5a-2cfb-40ed-ad65-698ff03a44cf-8761-kitkershamas1000-62fabdfea5a3c917225fd088-650df1f5-30f7-4db4-8c6f-f6e4204c4c37_1-1.jpg",
        volume: "1L cada",
        productId: "kit_propolis_energy_1l",
      },
      {
        name: "Kit Kerasys Repairing – Shampoo 180ml + Condicionador 180ml",
        description: "Kit reparador para cabelos danificados com fórmula rica em proteínas. Reconstrói a fibra capilar e restaura a elasticidade natural dos fios.",
        category: "kits-promocionais",
        originalPrice: "99.90",
        salePrice: "69.90",
        discountPercentage: 30,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/whatsapp-image-2025-03-13-at-161140-photoroom-1.jpg",
        volume: "180ml cada",
        productId: "kit_repairing_180ml",
      },

      // Shampoos
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
        name: "Kerasys Moisturizing – Shampoo 600ml",
        description: "Shampoo hidratante em tamanho familiar para cabelos secos. Fórmula enriquecida com agentes hidratantes que nutrem profundamente sem pesar.",
        category: "shampoo",
        originalPrice: "105.90",
        salePrice: "79.90",
        discountPercentage: 25,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/kerasys-moisturizing-shampoo-600ml-54652-1481950635773480425-1.jpg",
        volume: "600ml",
        productId: "moisturizing_shampoo_600ml",
      },
      {
        name: "Kerasys Oriental Premium – Shampoo 200ml",
        description: "Shampoo da linha Oriental Premium com fragrância sofisticada. Inspirado na tradição asiática de cuidados capilares com ingredientes nobres.",
        category: "shampoo",
        originalPrice: "39.99",
        salePrice: "29.99",
        discountPercentage: 25,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/a427cb89-d135-4267-9d99-71ce44709e5e-kerasys-oriental-premium-shampoo-200g_1-1.png",
        volume: "200ml",
        productId: "oriental_premium_shampoo_200ml",
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
        name: "Kerasys Perfume Lovely Romantic – Shampoo 600ml",
        description: "Shampoo perfumado com fragrância romântica e duradoura. Limpa suavemente enquanto deposita perfume delicado que permanece nos fios por horas.",
        category: "shampoo",
        originalPrice: "99.90",
        salePrice: "69.90",
        discountPercentage: 30,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/7b1a7e54-6dce-470b-8278-6f8d11bf249e-2024-12-19t162540400746019-kepelorosh600-65d364ccc4936428e5550c10-7c6ad39d-fb37-4303-a988-8c4319d2405c_1-1.jpg",
        volume: "600ml",
        productId: "perfume_lovely_romantic_shampoo_600ml",
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
        name: "Kerasys Revitalizing – Shampoo 180ml",
        description: "Shampoo revitalizante para cabelos sem vida e opacos. Fórmula energizante que devolve vitalidade e movimento natural aos fios.",
        category: "shampoo",
        originalPrice: "56.00",
        salePrice: "29.90",
        discountPercentage: 47,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/kerasys-revitalizing-shampoo-180g-54647-1381634674087053385_1-1.jpg",
        volume: "180ml",
        productId: "revitalizing_shampoo_180ml",
      },
      {
        name: "Kerasys Revitalizing – Shampoo 600ml",
        description: "Shampoo revitalizante em tamanho familiar para cabelos sem vitalidade. Fórmula que energiza e fortalece os fios, devolvendo movimento e brilho natural.",
        category: "shampoo",
        originalPrice: "112.78",
        salePrice: "79.90",
        discountPercentage: 29,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/5d94f7de-0b93-4136-a25a-3dd214e9f89c-kerasys-revitalizing-shampoo-600ml-1.png",
        volume: "600ml",
        productId: "revitalizing_shampoo_600ml",
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
      {
        name: "Shampoo Kerasys Propolis Energy – 1L",
        description: "Shampoo energizante com própolis para fortalecimento e proteção. Fórmula que cria película protetora nos fios, combatendo danos externos e dando energia aos cabelos.",
        category: "shampoo",
        originalPrice: "149.90",
        salePrice: "99.90",
        discountPercentage: 33,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/shampoo-kerasys-propolis-energy-1l-56c736c0-m41awjyxpw-1.webp",
        volume: "1L",
        productId: "propolis_energy_shampoo_1l",
      },

      // Condicionadores
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
        name: "Kerasys Clabo Romantic Citrus Deep Clean – Condicionador 960ml",
        description: "Condicionador de limpeza profunda com fragrância cítrica romântica. Fórmula que desintoxica os fios e couro cabeludo, removendo resíduos e impurezas.",
        category: "condicionador",
        originalPrice: "155.90",
        salePrice: "99.90",
        discountPercentage: 36,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/ff02440c-dacf-4505-a1b1-6a2d7c2dede8-mp146009-condicionador-kerasys-clabo-romantic-citrus-deep-clean-960ml_1-1.png",
        volume: "960ml",
        productId: "clabo_romantic_citrus_condicionador_960ml",
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
      {
        name: "KERASYS MOISTURIZING CONDICIONADOR 400 ML",
        description: "Condicionador hidratante em tamanho médio para cabelos ressecados. Fórmula concentrada que oferece hidratação duradoura sem acúmulo de resíduos.",
        category: "condicionador",
        originalPrice: "89.90",
        salePrice: "59.90",
        discountPercentage: 33,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/0c534086-65b7-4fd9-a1d8-2bf404530359-2024-10-09t153303969156781-kermoi020400-66ce14b94b567678abe903d7-f9243e22-09af-4aab-9160-0c6a099fb835-1.jpg",
        volume: "400ml",
        productId: "moisturizing_condicionador_400ml",
      },
      {
        name: "Kerasys Oriental Premium – Condicionador 200ml",
        description: "Condicionador Oriental Premium com fragrância asiática sofisticada. Tecnologia oriental que proporciona maciez sedosa e brilho intenso aos fios.",
        category: "condicionador",
        originalPrice: "69.90",
        salePrice: "39.90",
        discountPercentage: 43,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/0ba05c6f-b7e7-4998-b651-f8733595b36a-kerasys-oriental-premium-condicionador-200ml_1-1.png",
        volume: "200ml",
        productId: "oriental_premium_condicionador_200ml",
      },
      {
        name: "Kerasys Oriental Premium – Condicionador 600ml",
        description: "Condicionador Oriental Premium em tamanho econômico com fragrância duradoura. Proporciona maciez oriental e brilho sedoso com tecnologia asiática avançada.",
        category: "condicionador",
        originalPrice: "99.90",
        salePrice: "69.90",
        discountPercentage: 30,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/kerasys-oriental-premium-condicionador-600ml-54662-2969034784225539109_1-1.jpg",
        volume: "600ml",
        productId: "oriental_premium_condicionador_600ml",
      },
      {
        name: "Kerasys Repairing – Condicionador 180ml",
        description: "Condicionador reparador para cabelos danificados e quebradiços. Fórmula rica em proteínas que reconstrói a fibra capilar e previne quebra futura.",
        category: "condicionador",
        originalPrice: "49.90",
        salePrice: "37.89",
        discountPercentage: 24,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/kerasys-repairing-condicionador-180ml-54657-8450218047522127791_1-1.jpg",
        volume: "180ml",
        productId: "repairing_condicionador_180ml",
      },
      {
        name: "Kerasys Repairing – Condicionador 600ml",
        description: "Condicionador reparador em tamanho familiar para cabelos muito danificados. Tratamento intensivo que reconstrói profundamente a estrutura capilar.",
        category: "condicionador",
        originalPrice: "119.90",
        salePrice: "89.90",
        discountPercentage: 25,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/b38ed2a2-2061-4200-bba5-7e5318338719-kerasys-repairing-condicionador-600ml_1-1.png",
        volume: "600ml",
        productId: "repairing_condicionador_600ml",
      },
      {
        name: "Kerasys Revitalizing – Condicionador 180ml",
        description: "Condicionador revitalizante para cabelos sem vida e energia. Fórmula que devolve movimento, maciez e brilho natural aos fios opacos.",
        category: "condicionador",
        originalPrice: "49.90",
        salePrice: "35.90",
        discountPercentage: 28,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/kerasys-revitalizing-condicionador-180ml-54649-4093907699609780790_1-1.jpg",
        volume: "180ml",
        productId: "revitalizing_condicionador_180ml",
      },
      {
        name: "Kerasys Revitalizing – Condicionador 600ml",
        description: "Condicionador revitalizante em tamanho familiar para cabelos sem vitalidade. Energiza e fortalece os fios, proporcionando movimento e elasticidade natural.",
        category: "condicionador",
        originalPrice: "109.90",
        salePrice: "79.90",
        discountPercentage: 27,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/kerasys-revitalizing-condicionador-600ml-54650-4353224531851494827-1.jpg",
        volume: "600ml",
        productId: "revitalizing_condicionador_600ml",
      },

      // Tratamentos
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
        name: "Kerasys Advanced Moisture Ampoule 10x – Máscara Capilar 300ml",
        description: "Máscara com ampola de hidratação 10x mais concentrada. Tratamento intensivo que oferece hidratação profunda e duradoura para cabelos ressecados.",
        category: "tratamento",
        originalPrice: "115.90",
        salePrice: "85.90",
        discountPercentage: 26,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/a4feeeb4-0c89-4563-9cc9-15fd1e065ea1-2023-11-02t144851691408143-mascara-kerasys-advance-ampoule-moisture-10x-hair-pack-300mljpg14366720382224873603-1.jpg",
        volume: "300ml",
        productId: "advanced_moisture_ampoule_mascara_300ml",
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
        name: "Kerasys Moisture Clinic – Máscara Capilar 300ml",
        description: "Máscara da linha Moisture Clinic para hidratação clínica. Tratamento profissional que restaura o equilíbrio hídrico dos cabelos ressecados.",
        category: "tratamento",
        originalPrice: "99.90",
        salePrice: "79.90",
        discountPercentage: 20,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/9982f768-0343-4479-b74d-e8694c5bae4a-mp154529-mascara-kerasys-moisture-clinic-treatment-300ml-1.png",
        volume: "300ml",
        productId: "moisture_clinic_mascara_300ml",
      },
      {
        name: "Kerasys Própolis Shine – Máscara Capilar 1L",
        description: "Máscara com própolis para brilho intenso e proteção. Cria película protetora nos fios, oferecendo brilho duradouro e proteção contra danos ambientais.",
        category: "tratamento",
        originalPrice: "159.90",
        salePrice: "99.90",
        discountPercentage: 38,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/5beb91d7-1114-4913-98e2-617b8314ebef-mp146015-mascara-kerasys-propolis-shine-1000ml-1.png",
        volume: "1L",
        productId: "propolis_shine_mascara_1l",
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
      {
        name: "Tratamento Kerasys Salon de Magie 200ml",
        description: "Tratamento profissional Salon de Magie para transformação capilar. Fórmula mágica que oferece reparo instantâneo e brilho excepcional.",
        category: "tratamento",
        originalPrice: "150.00",
        salePrice: "79.90",
        discountPercentage: 47,
        imageUrl: "https://xn--kersys-kta.com/wp-content/uploads/2025/04/201bc7c6-5dec-4033-8aad-101741f44d38-mp154527-tratamento-kerasys-salon-de-magie-200ml-1.png",
        volume: "200ml",
        productId: "tratamento_salon_de_magie_200ml",
      },
    ];

    productsData.forEach((product) => {
        salePrice: "199.00",
        discountPercentage: 26,
        imageUrl: "https://elausa.com.br/media/catalog/product/cache/7e6530eafeba14d76580b06e3b5d93ee/l/o/lovely_senka.png",
        volume: "Kit 600ml cada",
        productId: "lovely_senka",
      },
      {
        name: "Kerasys Perfume Lovely Romantic Shampoo 400ml + Condicionador 400ml",
        description: "Kit com shampoo e condicionador perfumado da linha Lovely Romantic em tamanho compacto. Fragrância delicada e duradoura, ideal para uso diário.",
        category: "kits-promocionais", 
        originalPrice: "209.80",
        salePrice: "169.90",
        discountPercentage: 19,
        imageUrl: "https://elausa.com.br/media/catalog/product/cache/7e6530eafeba14d76580b06e3b5d93ee/s/h/shampoo_e_cond_lovely_romantic_400ml.png",
        volume: "Kit 400ml cada",
        productId: "shampoo_e_cond_lovely_romantic_400ml",
      },
      {
        name: "Kerasys Revitalizing Rosehip Oil Duo Shampoo + Condicionador 180ml",
        description: "Kit duo da linha Revitalizing com óleo de rosa mosqueta para cabelos finos e com frizz. Fórmula que revitaliza e fortalece os fios fragilizados.",
        category: "kits-promocionais",
        originalPrice: "129.80",
        salePrice: "45.90",
        discountPercentage: 65,
        imageUrl: "https://elausa.com.br/media/catalog/product/cache/7e6530eafeba14d76580b06e3b5d93ee/r/e/revitalizing_duo.jpg",
        volume: "Kit 180ml cada",
        productId: "revitalizing_duo",
      },
      
      // Shampoos
      {
        name: "Kerasys - Oriental Premium Red Camellia Oil EX - Shampoo 600ml (Nova Fórmula)",
        description: "Shampoo premium inspirado na sabedoria asiática com óleo de camélia vermelha. Sistema de cuidados orientais com super nutrição, fortalecimento capilar e brilho intenso.",
        category: "shampoo",
        originalPrice: "139.90",
        salePrice: "109.90",
        discountPercentage: 21,
        imageUrl: "https://elausa.com.br/media/catalog/product/cache/7e6530eafeba14d76580b06e3b5d93ee/o/r/oriental_p_sh_600.png",
        volume: "600ml",
        productId: "oriental_p_sh_600",
      },
      {
        name: "Kerasys Moisturizing Baobab Oil Shampoo 600ml",
        description: "Shampoo hidratante com óleo de baobá para cabelos secos e ressecados. Fórmula enriquecida que proporciona hidratação profunda e nutrição intensa.",
        category: "shampoo",
        originalPrice: "129.90",
        salePrice: "99.90",
        discountPercentage: 23,
        imageUrl: "https://elausa.com.br/media/catalog/product/cache/7e6530eafeba14d76580b06e3b5d93ee/m/o/moisturizing_sh_600_1.png",
        volume: "600ml",
        productId: "moisturizing_sh_600_1",
      },
      {
        name: "Kerasys - Revitalizing Shampoo Rosehip Oil 180ml",
        description: "Shampoo revitalizante com óleo de rosa mosqueta para cabelos finos e fragilizados. Fórmula que fortalece e revitaliza os fios sem pesar.",
        category: "shampoo",
        originalPrice: "49.90",
        salePrice: "39.90",
        discountPercentage: 20,
        imageUrl: "https://elausa.com.br/media/catalog/product/cache/7e6530eafeba14d76580b06e3b5d93ee/r/e/revitalizing_sh.jpg",
        volume: "180ml",
        productId: "revitalizing_sh",
      },
      {
        name: "Kerasys Repairing Argan Oil Shampoo 180ml",
        description: "Shampoo reparador com óleo de argan marroquino para cabelos danificados. Fórmula que limpa suavemente enquanto repara e fortalece os fios.",
        category: "shampoo",
        originalPrice: "109.90",
        salePrice: "49.90",
        discountPercentage: 55,
        imageUrl: "https://elausa.com.br/media/catalog/product/cache/7e6530eafeba14d76580b06e3b5d93ee/r/e/repairing_sh.jpg",
        volume: "180ml",
        productId: "repairing_sh",
      },
      {
        name: "Kerasys Moisturizing Baobab Oil Shampoo - 180ml",
        description: "Shampoo hidratante com óleo de baobá em embalagem compacta. Fórmula concentrada que oferece hidratação intensa para cabelos secos.",
        category: "shampoo",
        originalPrice: "109.90",
        salePrice: "39.90",
        discountPercentage: 64,
        imageUrl: "https://elausa.com.br/media/catalog/product/cache/7e6530eafeba14d76580b06e3b5d93ee/m/o/moisturizing_3.jpg",
        volume: "180ml",
        productId: "moisturizing_3",
      },
      {
        name: "Kerasys Repairing Argan Oil Shampoo 600ml (Nova Embalagem)",
        description: "Shampoo reparador com óleo de argan em embalagem econômica. Nova fórmula aprimorada que oferece reparação intensa para cabelos danificados.",
        category: "shampoo",
        originalPrice: "129.90",
        salePrice: "109.90",
        discountPercentage: 15,
        imageUrl: "https://elausa.com.br/media/catalog/product/cache/7e6530eafeba14d76580b06e3b5d93ee/r/e/repairing_1_5.jpg",
        volume: "600ml",
        productId: "repairing_1_5",
      },
      {
        name: "Kerasys Scalp Balancing Shampoo 180ml",
        description: "Shampoo equilibrante para couro cabeludo oleoso e com caspa. Fórmula anti-dandruff que remove impurezas e equilibra a oleosidade.",
        category: "shampoo",
        originalPrice: "59.90",
        salePrice: "49.90",
        discountPercentage: 17,
        imageUrl: "https://elausa.com.br/media/catalog/product/cache/7e6530eafeba14d76580b06e3b5d93ee/b/a/bal.jpg",
        volume: "180ml",
        productId: "bal",
      },
      {
        name: "Kerasys Perfume - Lovely Romantic Shampoo 600ml",
        description: "Shampoo perfumado com fragrância romântica duradoura. Fórmula que limpa suavemente enquanto deposita perfume delicado nos fios.",
        category: "shampoo",
        originalPrice: "129.90",
        salePrice: "129.90",
        discountPercentage: 0,
        imageUrl: "https://elausa.com.br/media/catalog/product/cache/7e6530eafeba14d76580b06e3b5d93ee/s/h/shampoo_lovely_romantic_600ml.png",
        volume: "600ml",
        productId: "shampoo_lovely_romantic_600ml",
      },
      
      // Condicionadores
      {
        name: "Kerasys Repairing Argan Oil Condicionador 180ml",
        description: "Condicionador reparador enriquecido com óleo de argan que nutre profundamente os fios danificados. Restaura maciez, brilho e maleabilidade.",
        category: "condicionador",
        originalPrice: "69.90",
        salePrice: "37.77",
        discountPercentage: 46,
        imageUrl: "https://elausa.com.br/media/catalog/product/cache/7e6530eafeba14d76580b06e3b5d93ee/r/e/repairing_cd.jpg",
        volume: "180ml",
        productId: "repairing_cd",
      },
      {
        name: "Kerasys Coconut Oil Condicionador 1L (Made in Korea) - Nova Embalagem!",
        description: "Condicionador com óleo de coco para cabelos secos e danificados. Fórmula coreana autêntica com hidratação intensa e nutrição profunda.",
        category: "condicionador",
        originalPrice: "179.90",
        salePrice: "97.77",
        discountPercentage: 46,
        imageUrl: "https://elausa.com.br/media/catalog/product/cache/7e6530eafeba14d76580b06e3b5d93ee/c/o/coconut_oil_conditioner_new_package.jpg",
        volume: "1L",
        productId: "coconut_oil_conditioner_new_package",
      },
      {
        name: "Kerasys Natural Recipe - Tea Tree Oil - Condicionador 1L (Made in Korea) - Nova Embalagem",
        description: "Condicionador com óleo de tea tree para limpeza e purificação. Fórmula natural que combate oleosidade e proporciona frescor.",
        category: "condicionador",
        originalPrice: "199.90",
        salePrice: "157.77",
        discountPercentage: 21,
        imageUrl: "https://elausa.com.br/media/catalog/product/cache/7e6530eafeba14d76580b06e3b5d93ee/t/e/tea_tree_cd_1l.png",
        volume: "1L",
        productId: "tea_tree_cd_1l",
      },
      {
        name: "Kerasys Perfume - Lovely Romantic Conditioner 600ml",
        description: "Condicionador perfumado com fragrância romântica. Condiciona os fios enquanto deixa fragância delicada e duradoura.",
        category: "condicionador",
        originalPrice: "139.90",
        salePrice: "99.90",
        discountPercentage: 29,
        imageUrl: "https://elausa.com.br/media/catalog/product/cache/7e6530eafeba14d76580b06e3b5d93ee/c/o/cond_lovely_romantic_600ml.png",
        volume: "600ml",
        productId: "cond_lovely_romantic_600ml",
      },
      {
        name: "Kerasys Perfume - Lovely Romantic Conditioner 400ml",
        description: "Condicionador perfumado com fragrância romântica em tamanho compacto. Perfeito para uso diário com resultados profissionais.",
        category: "condicionador",
        originalPrice: "109.90",
        salePrice: "49.90",
        discountPercentage: 55,
        imageUrl: "https://elausa.com.br/media/catalog/product/cache/7e6530eafeba14d76580b06e3b5d93ee/c/o/cond_lovely_romantic_400ml.png",
        volume: "400ml",
        productId: "cond_lovely_romantic_400ml",
      },
      {
        name: "Kerasys - Revitalizing Rosehip Oil Condicionador 500ml (Refil)",
        description: "Condicionador revitalizante com óleo de rosa mosqueta em refil econômico. Fórmula que revitaliza cabelos finos e com frizz.",
        category: "condicionador",
        originalPrice: "109.90",
        salePrice: "67.77",
        discountPercentage: 38,
        imageUrl: "https://elausa.com.br/media/catalog/product/cache/7e6530eafeba14d76580b06e3b5d93ee/r/e/revitalizing_cd_2.jpg",
        volume: "500ml",
        productId: "revitalizing_cd_2",
      },
      
      // Tratamentos
      {
        name: "Kerasys Advanced Moisture Ampoule 10x – Ceramide Ampoule Serum 80ml",
        description: "Ampola de tratamento intensivo com ceramidas para hidratação profunda. Fórmula concentrada 10x mais potente com tecnologia de liberação gradual.",
        category: "tratamento",
        originalPrice: "169.90",
        salePrice: "99.90",
        discountPercentage: 41,
        imageUrl: "https://elausa.com.br/media/catalog/product/cache/7e6530eafeba14d76580b06e3b5d93ee/m/o/moisture_6.jpg",
        volume: "80ml",
        productId: "moisture_6",
      },
      {
        name: "Kerasys - Keratin Bond Deep Repair Treatment 600ml",
        description: "Tratamento reparador profundo com tecnologia Keratin Bond para cabelos extremamente danificados. Reconstrói a estrutura capilar intensivamente.",
        category: "tratamento",
        originalPrice: "199.90",
        salePrice: "129.90",
        discountPercentage: 35,
        imageUrl: "https://elausa.com.br/media/catalog/product/cache/7e6530eafeba14d76580b06e3b5d93ee/k/e/keratin_bond_deep_repair_tr_600_1.png",
        volume: "600ml",
        productId: "keratin_bond_deep_repair_tr_600_1",
      },
      
      // Linha Argan Oil - Produtos populares globalmente
      {
        name: "Kerasys Shampoo 1L - Argan Oil - Cabelos Extremamente Secos e Danificados (Made in Korea)",
        description: "Shampoo profissional com óleo de argan puro para cabelos extremamente secos e danificados. Fórmula coreana premium com 100ppm de óleo de argan, rico em vitamina E e aminoácidos. Ideal para cabelos que passaram por processos químicos agressivos.",
        category: "shampoo",
        originalPrice: "199.90",
        salePrice: "159.90",
        discountPercentage: 20,
        imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ksy/ksy84888/u/9.jpg",
        volume: "1L",
        productId: "argan_oil_shampoo_1l",
      },
      {
        name: "Kerasys Condicionador 1L - Argan Oil - Cabelos Extremamente Secos e Danificados (Made in Korea)",
        description: "Máscara de nutrição profissional com óleo de argan marroquino para recuperação intensa. Fórmula com 17 aminoácidos essenciais, queratina hidrolisada e ácido hialurônico. Sela cutículas e elimina pontas duplas em cabelos extremamente danificados.",
        category: "condicionador",
        originalPrice: "199.90",
        salePrice: "169.90",
        discountPercentage: 15,
        imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ksy/ksy84968/u/9.jpg",
        volume: "1L",
        productId: "argan_oil_conditioner_1l",
      },
      {
        name: "Kerasys Argan Oil Serum 100ml",
        description: "Sérum leave-in com óleo de argan concentrado para finalização e proteção. Fórmula não oleosa que protege contra danos térmicos até 230°C, controla frizz e adiciona brilho intenso. Aplicação em cabelos úmidos ou secos.",
        category: "tratamento",
        originalPrice: "159.90",
        salePrice: "99.90",
        discountPercentage: 38,
        imageUrl: "https://elausa.com.br/media/catalog/product/cache/de15d049429dcfdbb1ad0a5ba12093f7/_/e/_ex_100ml_.png",
        volume: "100ml",
        productId: "argan_oil_serum_100ml",
      },
      
      // Linha Moisturizing Baobab Oil - Mais vendidos globalmente
      {
        name: "Kerasys Moisturizing Baobab Oil Condicionador 600ml",
        description: "Condicionador hidratante com óleo de baobá africano para cabelos secos e ressecados. Rico em vitaminas A, D, E e F, proporciona hidratação profunda e nutrição intensa. Ideal para cabelos que precisam de umidade e maciez.",
        category: "condicionador",
        originalPrice: "129.90",
        salePrice: "89.90",
        discountPercentage: 31,
        imageUrl: "https://elausa.com.br/media/catalog/product/cache/6b43fd4dce2c19d548b80844c5c1dd03/m/o/moisturizing_conditioner_2.jpg",
        volume: "600ml",
        productId: "moisturizing_cd_600",
      },
      {
        name: "Kerasys Moisturizing Baobab Oil Condicionador 180ml",
        description: "Condicionador hidratante com óleo de baobá em tamanho travel size. Fórmula concentrada que oferece hidratação intensa para cabelos secos. Perfeito para viagens ou para testar a linha.",
        category: "condicionador",
        originalPrice: "69.90",
        salePrice: "49.90",
        discountPercentage: 29,
        imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ksy/ksy84968/u/9.jpg",
        volume: "180ml",
        productId: "moisturizing_cd_180",
      },
      
      // Linha Revitalizing Rosehip Oil - Para cabelos finos
      {
        name: "Kerasys - Revitalizing Rosehip Oil Condicionador 180ml",
        description: "Condicionador revitalizante com óleo de rosa mosqueta para cabelos finos e com frizz. Fórmula leve que não pesa nos fios, proporcionando volume natural e controle do frizz. Rico em vitamina C e antioxidantes.",
        category: "condicionador",
        originalPrice: "59.90",
        salePrice: "39.90",
        discountPercentage: 33,
        imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ksy/ksy84970/u/9.jpg",
        volume: "180ml",
        productId: "revitalizing_cd_180",
      },
      
      // Linha Keratin Bond - Produtos individuais mais vendidos
      {
        name: "Kerasys - Keratin Bond Silky Moisture Shampoo 600ml",
        description: "Shampoo hidratante com tecnologia Keratin Bond para cabelos ressecados. Fórmula enriquecida com ceramidas, manteiga de karité e ácido cítrico que repõe umidade, melhora textura e combate porosidade. Deixa os cabelos sedosos e brilhantes.",
        category: "shampoo",
        originalPrice: "189.90",
        salePrice: "149.90",
        discountPercentage: 21,
        imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ksy/ksy31660/u/8.jpg",
        volume: "600ml",
        productId: "keratin_bond_silky_moisture_sh_600",
      },
      {
        name: "Kerasys - Keratin Bond Deep Repair Shampoo 600ml",
        description: "Shampoo reparador profundo com tecnologia Keratin Bond para cabelos extremamente danificados. Fórmula intensiva que reconstrói estrutura capilar, fortalece fios e previne futuras quebras. Ideal para cabelos que passaram por processos químicos.",
        category: "shampoo",
        originalPrice: "189.90",
        salePrice: "149.90",
        discountPercentage: 21,
        imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ksy/ksy31663/u/8.jpg",
        volume: "600ml",
        productId: "keratin_bond_deep_repair_sh_600",
      },
      {
        name: "Kerasys - Keratin Bond Volume Treatment 600ml",
        description: "Tratamento volumizador com tecnologia Keratin Bond para cabelos finos e sem volume. Fórmula leve que hidrata e fortalece enquanto proporciona volume natural sem pesar. Ideal para cabelos que precisam de corpo e movimento.",
        category: "tratamento",
        originalPrice: "189.90",
        salePrice: "149.90",
        discountPercentage: 21,
        imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ksy/ksy42190/u/8.jpg",
        volume: "600ml",
        productId: "keratin_bond_volume_tr_600",
      },
      {
        name: "Kerasys - Keratin Bond Silky Moisture Treatment 600ml",
        description: "Tratamento hidratante com tecnologia Keratin Bond que oferece maciez sedosa aos fios. Fórmula rica em ceramidas que restaura umidade perdida, melhora textura e combate porosidade. Deixa cabelos macios, brilhantes e sedosos.",
        category: "tratamento",
        originalPrice: "189.90",
        salePrice: "149.90",
        discountPercentage: 21,
        imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ksy/ksy99273/u/8.jpg",
        volume: "600ml",
        productId: "keratin_bond_silky_moisture_tr_600",
      },
      
      // Linha Perfume Lovely Romantic - Produtos individuais
      {
        name: "Kerasys Perfume - Lovely Romantic Shampoo 180ml",
        description: "Shampoo perfumado da linha Lovely Romantic em tamanho compacto. Fórmula zero silicone com 10 essências florais e 3 óleos herbais. Fragrância romântica duradoura que permanece nos cabelos. Ideal para couro cabeludo oleoso com pontas ressecadas.",
        category: "shampoo",
        originalPrice: "69.90",
        salePrice: "49.90",
        discountPercentage: 29,
        imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ksy/ksy99270/u/16.jpg",
        volume: "180ml",
        productId: "perfume_lovely_romantic_sh_180",
      },
      {
        name: "Kerasys Perfume - Lovely Romantic Shampoo 400ml",
        description: "Shampoo perfumado com fragrância romântica em tamanho médio. Fórmula com essências florais premium que limpa suavemente enquanto deposita perfume delicado. Ideal para uso diário com resultados profissionais.",
        category: "shampoo",
        originalPrice: "109.90",
        salePrice: "79.90",
        discountPercentage: 27,
        imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ksy/ksy99270/u/16.jpg",
        volume: "400ml",
        productId: "perfume_lovely_romantic_sh_400",
      },
      
      // Linha Scalp Care
      {
        name: "Kerasys Scalp Balancing Condicionador 180ml",
        description: "Condicionador equilibrante para couro cabeludo sensível e oleoso. Fórmula suave que hidrata os fios sem pesar no couro cabeludo. Controla oleosidade excessiva e proporciona equilíbrio ideal para cabelos mistos.",
        category: "condicionador",
        originalPrice: "59.90",
        salePrice: "39.90",
        discountPercentage: 33,
        imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ksy/ksy24055/u/8.jpg",
        volume: "180ml",
        productId: "scalp_balancing_cd_180",
      },
      
      // Kits Adicionais Populares
      {
        name: "Kit Kerasys Repairing Argan Oil Duo (Shampoo 180ml + Condicionador 180ml) + Brinde",
        description: "Kit completo da linha Argan Oil com shampoo e condicionador reparadores. Fórmula concentrada para cabelos danificados com óleo de argan marroquino. Inclui brinde especial Ice Professional Repair My Hair Spray para proteção térmica.",
        category: "kits-promocionais",
        originalPrice: "179.80",
        salePrice: "87.77",
        discountPercentage: 51,
        imageUrl: "https://elausa.com.br/media/catalog/product/cache/6b43fd4dce2c19d548b80844c5c1dd03/r/e/repairing_duo.jpg",
        volume: "Kit 180ml cada + Brinde",
        productId: "kit_argan_oil_duo_brinde",
      },
      {
        name: "Kerasys Moisturizing Baobab Oil Kit Duo (Shampoo + Condicionador 600ml)",
        description: "Kit completo da linha Moisturizing com shampoo e condicionador de 600ml cada. Fórmula com óleo de baobá africano para hidratação profunda de cabelos secos. Combinação perfeita para cuidado diário intensivo.",
        category: "kits-promocionais",
        originalPrice: "259.80",
        salePrice: "189.90",
        discountPercentage: 27,
        imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ksy/ksy84968/u/9.jpg",
        volume: "Kit 600ml cada",
        productId: "moisturizing_kit_duo_600",
      },
      {
        name: "Kerasys Keratin Bond Silky Moisture Kit (Shampoo 600ml e Tratamento 600ml)",
        description: "Kit completo da linha Keratin Bond Silky Moisture com shampoo e tratamento de 600ml cada. Tecnologia Keratin Bond que reconstrói estrutura capilar e oferece maciez sedosa. Fórmula com ceramidas e ácido cítrico para hidratação profunda.",
        category: "kits-promocionais",
        originalPrice: "379.80",
        salePrice: "279.90",
        discountPercentage: 26,
        imageUrl: "https://elausa.com.br/media/catalog/product/cache/6b43fd4dce2c19d548b80844c5c1dd03/k/e/keratin_bond_-_silky_moisture_1.png",
        volume: "Kit 600ml cada",
        productId: "keratin_bond_silky_moisture_kit_600",
      },
      
      // Linha Oriental Premium - Mais vendida globalmente
      {
        name: "Kerasys Oriental Premium Red Camellia Oil Condicionador 600ml (Nova Fórmula)",
        description: "Condicionador premium da linha Oriental com óleo de camélia vermelha asiática. Sistema oriental de cuidados que proporciona nutrição profunda, fortalecimento e brilho excepcional. Enriquecido com extratos orientais tradicionais e óleos nobres.",
        category: "condicionador",
        originalPrice: "149.90",
        salePrice: "119.90",
        discountPercentage: 20,
        imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ksy/ksy31663/u/8.jpg",
        volume: "600ml",
        productId: "oriental_premium_cd_600",
      },
      {
        name: "Kerasys Oriental Premium Red Camellia Oil Treatment 200ml",
        description: "Tratamento premium com óleo de camélia vermelha e essências orientais. Fórmula concentrada com ginseng, crisântemo e orquídea que revitaliza cabelos danificados pela química. Ideal para mechas, luzes e cabelos que precisam de reparação profunda.",
        category: "tratamento",
        originalPrice: "139.90",
        salePrice: "89.90",
        discountPercentage: 36,
        imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ksy/ksy31666/u/8.jpg",
        volume: "200ml",
        productId: "oriental_premium_tr_200",
      },
      
      // Ampolas e Tratamentos Intensivos
      {
        name: "Kerasys Advanced Repair Ampoule 10x - Protein Recovery 80ml",
        description: "Ampola de tratamento proteico avançado para cabelos severamente danificados. Fórmula concentrada 10x com proteínas hidrolisadas e aminoácidos que reconstrói estrutura capilar em profundidade. Resultados instantâneos de reparação.",
        category: "tratamento",
        originalPrice: "169.90",
        salePrice: "119.90",
        discountPercentage: 29,
        imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ksy/ksy31671/u/8.jpg",
        volume: "80ml",
        productId: "advanced_repair_ampoule_protein",
      },
      {
        name: "Kerasys Advanced Volume Ampoule 10x - Volumizing Serum 80ml",
        description: "Ampola volumizadora avançada para cabelos finos e sem corpo. Fórmula concentrada 10x que proporciona volume duradouro sem pesar os fios. Tecnologia de liberação gradual para resultados que duram até 72 horas.",
        category: "tratamento",
        originalPrice: "169.90",
        salePrice: "119.90",
        discountPercentage: 29,
        imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ksy/ksy42187/u/8.jpg",
        volume: "80ml",
        productId: "advanced_volume_ampoule",
      },
      
      // Linha Elegance & Sensual - Produtos mais vendidos mundialmente
      {
        name: "Kerasys Elegance & Sensual Perfumed Shampoo 600ml - Sistema de Fragrância 3 Camadas",
        description: "Shampoo perfumado com sistema único de fragrância de 3 camadas (topo, meio, base). Notas de maçã, íris, pêssego (topo), tuberosa, ylang ylang (meio), sândalo, almíscar (base). Fragrância duradoura que permanece nos cabelos até o dia seguinte. Produto mais vendido globalmente na linha perfumada.",
        category: "shampoo",
        originalPrice: "149.90",
        salePrice: "119.90",
        discountPercentage: 20,
        imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ksy/ksy99271/u/8.jpg",
        volume: "600ml",
        productId: "elegance_sensual_shampoo_600",
      },
      {
        name: "Kerasys Elegance & Sensual Perfumed Conditioner 600ml - Sistema de Fragrância Premium",
        description: "Condicionador perfumado com fragrância sofisticada de 3 camadas. Fórmula hidratante que deposita perfume delicado nos fios enquanto condiciona. Sistema de liberação gradual mantém a fragrância ativa por até 24 horas. Ideal para quem busca cabelos perfumados e sedosos.",
        category: "condicionador",
        originalPrice: "149.90",
        salePrice: "119.90",
        discountPercentage: 20,
        imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ksy/ksy99274/u/8.jpg",
        volume: "600ml",
        productId: "elegance_sensual_conditioner_600",
      },
      
      // Linha Natural Recipe Tea Tree Oil - Popular para couro cabeludo oleoso
      {
        name: "Kerasys Natural Recipe Tea Tree Oil Shampoo 1L - Anti-caspa e Purificante",
        description: "Shampoo purificante com óleo de tea tree australiano para couro cabeludo oleoso e com caspa. Fórmula natural que equilibra oleosidade, combate bactérias e proporciona sensação refrescante. Tamanho família 1L para uso prolongado. Popular na Coreia para problemas de couro cabeludo.",
        category: "shampoo",
        originalPrice: "179.90",
        salePrice: "149.90",
        discountPercentage: 17,
        imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ksy/ksy84888/u/9.jpg",
        volume: "1L",
        productId: "tea_tree_oil_shampoo_1l",
      },
      {
        name: "Kerasys Natural Recipe Tea Tree Oil Conditioner 1L - Equilibrante e Refrescante",
        description: "Condicionador equilibrante com óleo de tea tree que hidrata os fios sem pesar no couro cabeludo oleoso. Fórmula leve com propriedades antibacterianas e antifúngicas. Ideal para uso diário em cabelos mistos (raiz oleosa e pontas secas).",
        category: "condicionador",
        originalPrice: "179.90",
        salePrice: "149.90",
        discountPercentage: 17,
        imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ksy/ksy84968/u/9.jpg",
        volume: "1L",
        productId: "tea_tree_oil_conditioner_1l",
      },
      
      // Linha Hair Clinic System - Produtos clínicos profissionais
      {
        name: "Kerasys Hair Clinic System Oriental Premium Shampoo 600ml - Fórmula Profissional",
        description: "Shampoo profissional da linha Hair Clinic com tecnologia oriental premium. Contém complexo de proteínas duplas, óleo de camélia e extratos orientais (ginseng, crisântemo, orquídea). Fortalece raízes, adiciona brilho e revitaliza cabelos enfraquecidos. Usado em salões profissionais coreanos.",
        category: "shampoo",
        originalPrice: "169.90",
        salePrice: "139.90",
        discountPercentage: 18,
        imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ksy/ksy84890/u/8.jpg",
        volume: "600ml",
        productId: "hair_clinic_oriental_premium_sh_600",
      },
      {
        name: "Kerasys Hair Clinic System Oriental Premium Conditioner 600ml - Tratamento Clínico",
        description: "Condicionador profissional da linha Hair Clinic com fórmula clínica oriental. Sistema de reparação profunda com camélia japonica, proteínas hidrolisadas e essências orientais. Reconstrói estrutura capilar e oferece nutrição intensiva para cabelos severamente danificados.",
        category: "condicionador",
        originalPrice: "169.90",
        salePrice: "139.90",
        discountPercentage: 18,
        imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ksy/ksy84970/u/9.jpg",
        volume: "600ml",
        productId: "hair_clinic_oriental_premium_cd_600",
      },
      {
        name: "Kerasys Hair Clinic System Oriental Premium Treatment 200ml - Máscara Profissional",
        description: "Tratamento intensivo da linha Hair Clinic com concentração máxima de ativos orientais. Máscara profissional com óleo de camélia vermelha, extratos de orquídea e ginseng. Uso semanal para reparação profunda de cabelos danificados por processos químicos.",
        category: "tratamento",
        originalPrice: "149.90",
        salePrice: "99.90",
        discountPercentage: 33,
        imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ksy/ksy31666/u/8.jpg",
        volume: "200ml",
        productId: "hair_clinic_oriental_premium_tr_200",
      },
      
      // Linha Coconut Oil - Hidratação profunda
      {
        name: "Kerasys Coconut Oil Shampoo 1L - Hidratação Tropical Profunda (Made in Korea)",
        description: "Shampoo hidratante com óleo de coco virgem para cabelos extremamente secos. Fórmula rica em ácidos graxos essenciais, vitamina E e antioxidantes naturais. Proporciona hidratação tropical intensa, maciez e brilho natural. Fragrância delicada de coco que transporta para o paraíso.",
        category: "shampoo",
        originalPrice: "179.90",
        salePrice: "139.90",
        discountPercentage: 22,
        imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ksy/ksy99270/u/16.jpg",
        volume: "1L",
        productId: "coconut_oil_shampoo_1l",
      },
      {
        name: "Kerasys Coconut Oil Conditioner 1L - Máscara Nutritiva Tropical (Made in Korea)",
        description: "Condicionador intensivo com óleo de coco puro e própolis. Fórmula sem sulfatos que oferece nutrição profunda e selagem de cutículas. Ideal para cabelos ressecados pelo sol, sal ou processos químicos. Textura cremosa que envolve os fios em hidratação tropical.",
        category: "condicionador",
        originalPrice: "179.90",
        salePrice: "139.90",
        discountPercentage: 22,
        imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ksy/ksy99273/u/8.jpg",
        volume: "1L",
        productId: "coconut_oil_conditioner_1l",
      },
      
      // Produtos Anti-idade para cabelos
      {
        name: "Kerasys Advanced Age Care Shampoo 600ml - Anti-idade Capilar",
        description: "Shampoo anti-idade com peptídeos bioativos e colágeno hidrolisado para cabelos maduros. Fórmula avançada que fortalece fios enfraquecidos pelo tempo, restaura elasticidade e combate sinais de envelhecimento capilar. Ideal para cabelos após os 40 anos que perderam vitalidade.",
        category: "shampoo",
        originalPrice: "189.90",
        salePrice: "149.90",
        discountPercentage: 21,
        imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ksy/ksy31660/u/8.jpg",
        volume: "600ml",
        productId: "advanced_age_care_shampoo_600",
      },
      {
        name: "Kerasys Advanced Age Care Conditioner 600ml - Regeneração Anti-idade",
        description: "Condicionador regenerativo com tecnologia anti-idade para cabelos maduros. Complexo de peptídeos, ácido hialurônico e extratos antioxidantes que restauram densidade, brilho e movimento jovem aos fios. Combate sinais visíveis de envelhecimento capilar.",
        category: "condicionador",
        originalPrice: "189.90",
        salePrice: "149.90",
        discountPercentage: 21,
        imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ksy/ksy31671/u/8.jpg",
        volume: "600ml",
        productId: "advanced_age_care_conditioner_600",
      },
      
      // Linha para cabelos coloridos
      {
        name: "Kerasys Color Care Protection Shampoo 600ml - Proteção da Cor",
        description: "Shampoo protetor para cabelos coloridos e com mechas. Fórmula sem sulfatos com filtro UV e antioxidantes que preservam a cor por até 8 semanas. Limpa suavemente sem desbotar, mantém vibrância e protege contra desbotamento solar. Ideal para loiras, ruivas e colorações fantasia.",
        category: "shampoo",
        originalPrice: "169.90",
        salePrice: "129.90",
        discountPercentage: 24,
        imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ksy/ksy42187/u/8.jpg",
        volume: "600ml",
        productId: "color_care_protection_shampoo_600",
      },
      {
        name: "Kerasys Color Care Protection Conditioner 600ml - Nutrição Sem Desbotamento",
        description: "Condicionador nutritivo para cabelos coloridos com tecnologia de proteção da cor. Fórmula rica em aminoácidos e vitaminas que hidrata profundamente sem remover pigmentos. Prolonga duração da cor, adiciona brilho e mantém tonalidades vibrantes por mais tempo.",
        category: "condicionador",
        originalPrice: "169.90",
        salePrice: "129.90",
        discountPercentage: 24,
        imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ksy/ksy42190/u/8.jpg",
        volume: "600ml",
        productId: "color_care_protection_conditioner_600",
      },
      
      // Kits Populares Globalmente
      {
        name: "Kit Kerasys Elegance & Sensual Perfumed Duo Set (Shampoo + Conditioner 600ml cada)",
        description: "Kit completo da linha Elegance & Sensual mais vendida mundialmente. Conjunto com shampoo e condicionador perfumados de 600ml cada. Sistema de fragrância de 3 camadas que permanece nos cabelos por 24h. Ideal para quem busca cabelos perfumados com qualidade profissional coreana.",
        category: "kits-promocionais",
        originalPrice: "299.80",
        salePrice: "219.90",
        discountPercentage: 27,
        imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ksy/ksy99270/u/16.jpg",
        volume: "Kit 600ml cada",
        productId: "elegance_sensual_kit_duo_600",
      },
      {
        name: "Kit Kerasys Hair Clinic Oriental Premium Trio Professional (Shampoo + Conditioner + Treatment)",
        description: "Kit profissional completo Hair Clinic Oriental Premium. Trio com shampoo 600ml, condicionador 600ml e tratamento 200ml. Sistema clínico oriental com camélia, ginseng e proteínas para recuperação total de cabelos danificados. Resultados de salão em casa.",
        category: "kits-promocionais",
        originalPrice: "459.70",
        salePrice: "329.90",
        discountPercentage: 28,
        imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ksy/ksy84890/u/8.jpg",
        volume: "Kit Trio Profissional",
        productId: "hair_clinic_oriental_trio_professional",
      },
      {
        name: "Kit Kerasys Natural Recipe Mega Family Size (Tea Tree + Argan + Coconut Oil 1L cada)",
        description: "Kit família completo Natural Recipe com 3 linhas populares. Inclui Tea Tree Oil 1L (couro cabeludo oleoso), Argan Oil 1L (cabelos danificados) e Coconut Oil 1L (hidratação intensa). Economia máxima para famílias que usam produtos naturais coreanos premium.",
        category: "kits-promocionais",
        originalPrice: "539.70",
        salePrice: "399.90",
        discountPercentage: 26,
        imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ksy/ksy84888/u/9.jpg",
        volume: "Kit Família 3L total",
        productId: "natural_recipe_mega_family_kit",
      },
      
      // Produtos Inovadores
      {
        name: "Kerasys pH Balance Scalp Care Shampoo 600ml - Equilíbrio do pH",
        description: "Shampoo inovador com pH balanceado 5.5 para couro cabeludo sensível. Fórmula hipoalergênica com prebióticos que restaura microbioma capilar saudável. Controla oleosidade excessiva, reduz irritação e coceira. Ideal para quem sofre com desequilíbrios do couro cabeludo.",
        category: "shampoo",
        originalPrice: "159.90",
        salePrice: "119.90",
        discountPercentage: 25,
        imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ksy/ksy99272/u/8.jpg",
        volume: "600ml",
        productId: "ph_balance_scalp_care_shampoo_600",
      },
      {
        name: "Kerasys Protein Therapy Intensive Ampoule 50ml - Terapia Proteica Intensiva",
        description: "Ampola de terapia proteica concentrada para cabelos severamente danificados. Fórmula com 18 aminoácidos, queratina hidrolisada e colágeno que reconstrói estrutura capilar em nível molecular. Uso semanal para reparação extrema de cabelos quebrados, porosos ou químicamente tratados.",
        category: "tratamento",
        originalPrice: "199.90",
        salePrice: "149.90",
        discountPercentage: 25,
        imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ksy/ksy31663/u/8.jpg",
        volume: "50ml",
        productId: "protein_therapy_intensive_ampoule_50",
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
    const initialLength = sessionItems.length;
    const filteredItems = sessionItems.filter(item => item.productId !== productId);
    
    if (filteredItems.length < initialLength) {
      this.cartItems.set(sessionId, filteredItems);
      return true;
    }
    
    return false;
  }

  async clearCart(sessionId: string): Promise<void> {
    this.cartItems.set(sessionId, []);
  }
}

export const storage = new MemStorage();

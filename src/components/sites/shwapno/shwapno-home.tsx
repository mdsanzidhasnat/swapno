"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  MapPin,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBasket,
  Sparkles,
  Trash2,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import {
  SHWAPNO_CHECKOUT_STORAGE_KEY,
  type ShwapnoCheckoutItem,
} from "@/lib/shwapno-cart";
import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const ASSET = "/sites/shwapno/assets/";

type Product = {
  id: string;
  name: string;
  image: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  badge?: string;
  unit?: string;
};

type Shelf = {
  title: string;
  products: Product[];
  banner?: string;
  bannerAlt?: string;
  accent?: string;
};

const categories = [
  { name: "Eggs", image: "category-eggs.webp" },
  { name: "Tea", image: "category-tea.webp" },
  { name: "Soft Drinks", image: "category-soft-drinks.webp" },
  { name: "Frozen", image: "category-frozen.png" },
  { name: "Coffee", image: "category-coffee.webp" },
  { name: "Ice Cream", image: "category-ice-cream.webp" },
  { name: "Noodles", image: "category-noodles.webp" },
  { name: "Biscuits", image: "category-biscuits.webp" },
  { name: "Candy & Chocolate", image: "category-candy.webp" },
  { name: "Juice", image: "category-juice.webp" },
  { name: "Cereals", image: "category-cereals.webp" },
  { name: "Chips & Pretzels", image: "category-chips.webp" },
];

const departments = [
  "Food",
  "Baby Food & Care",
  "Diapers",
  "Home Cleaning",
  "Pet Essentials",
  "Beauty & Health",
  "Fashion & Lifestyle",
  "Home & Kitchen",
  "Stationeries",
  "Toys & Sports",
  "Gadget",
];

const quickLinks = [
  ["Great Deals", "/deals"],
  ["Winter Essentials", "/winter-essentials-2"],
  ["Unilever-Stock & Save", "/deals-on-unilever"],
  ["Buy & Save More", "/buy-save-more-2"],
  ["Our Brands", "/brands"],
  ["Women's Corner", "/womens-care-collection"],
];

const heroSlides = [
  { image: "hero-chal-daal.webp", alt: "Chal Daal", href: "/campaigns" },
  { image: "hero-pathao.webp", alt: "Pathao Banner", href: "/campaigns" },
  { image: "hero-chal-dal.webp", alt: "Chal Dal", href: "/Hot-Deals" },
  { image: "hero-unilever.webp", alt: "Deals On Unilever", href: "/unilever" },
  { image: "hero-himalaya.webp", alt: "Himalaya", href: "/himalaya" },
  { image: "hero-aci.jpeg", alt: "ACI Banner", href: "/aci-pure-foods" },
];

const popupSlides = [
  { image: "promo-popup.webp", alt: "Himalaya promotion" },
  { image: "promo-popup-daal.webp", alt: "Chal Daal promotion" },
];

const recommended: Product[] = [
  {
    id: "egg-loose",
    name: "Egg Loose",
    image: "product-egg.webp",
    price: "11.25",
    unit: "Per Piece  ·  Min. 12",
  },
  {
    id: "potato",
    name: "Alu (Potato) Regular Loose Kg",
    image: "product-potato.webp",
    price: "22",
    oldPrice: "30",
    discount: "৳8 OFF",
    badge: "Most Picked",
    unit: "Per 1kg  ·  Min. 1kg",
  },
  {
    id: "onion",
    name: "Piyaj (Onion) Local Loose (P) Kg",
    image: "product-onion.webp",
    price: "50",
    unit: "Per 1kg  ·  Min. 1kg",
  },
  {
    id: "salt",
    name: "ACI Pure Salt 1kg",
    image: "product-salt.webp",
    price: "42",
    badge: "Most Picked",
    unit: "Per Piece",
  },
  {
    id: "lentils",
    name: "Moshur Dal Loose Standard Kg",
    image: "product-lentils.webp",
    price: "95",
    oldPrice: "105",
    discount: "৳10 OFF",
    badge: "Most Picked",
    unit: "Per 1kg  ·  Min. 250gm",
  },
];

const shelves: Shelf[] = [
  {
    title: "WEEKDAY DEALS!!!",
    accent: "weekday",
    products: [
      {
        id: "pran-milk",
        name: "Pran Full Cream Milk Powder 500gm",
        image: "weekday-pran-milk.webp",
        price: "430",
        oldPrice: "480",
        discount: "৳50 OFF",
        badge: "Most Picked",
      },
      {
        id: "pusti-milk",
        name: "Pusti Plus Instant Full Cream Milk Powder 1kg",
        image: "weekday-pusti-milk.webp",
        price: "820",
        oldPrice: "950",
        discount: "৳130 OFF",
        badge: "Top Seller",
      },
      {
        id: "fresh-milk",
        name: "Fresh Instant Full Cream Milk Powder 500gm",
        image: "weekday-fresh-milk.webp",
        price: "450",
        badge: "Most Picked",
      },
      {
        id: "fresh-milk-large",
        name: "Fresh Instant Full Cream Milk Powder 1kg",
        image: "weekday-fresh-milk-large.webp",
        price: "850",
        oldPrice: "900",
        discount: "৳50 OFF",
      },
    ],
  },
  {
    title: "REFRESH WITH HIMALAYA",
    banner: "banner-himalaya.webp",
    bannerAlt: "Himalaya special offer",
    products: [
      {
        id: "himalaya-facewash",
        name: "Himalaya Brightening Vitamin-C Orange Face Wash 100ml",
        image: "himalaya-facewash.webp",
        price: "121",
        oldPrice: "220",
        discount: "৳99 OFF",
      },
      {
        id: "himalaya-neem",
        name: "Himalaya Purifying Neem Face Wash 150ml",
        image: "himalaya-neem.webp",
        price: "229",
        oldPrice: "299",
        discount: "৳70 OFF",
      },
      {
        id: "himalaya-shampoo",
        name: "Himalaya Anti-Dandruff Shampoo 180ml",
        image: "himalaya-shampoo.webp",
        price: "325",
        badge: "New B1G1",
      },
      {
        id: "himalaya-neem-small",
        name: "Himalaya Purifying Neem Face Wash 100ml",
        image: "himalaya-neem-small.webp",
        price: "175",
      },
    ],
  },
  {
    title: "HOT & TRENDING RIGHT NOW 🔥",
    products: [
      {
        id: "ama-milk",
        name: "AMA Full Cream Milk Powder 1kg",
        image: "trending-ama-milk.webp",
        price: "870",
        badge: "Top Seller",
      },
      {
        id: "mirzapore-tea",
        name: "Ispahani Mirzapore Bestleaf 400gm",
        image: "trending-mirzapore-tea.webp",
        price: "218",
        oldPrice: "248",
        discount: "৳30 OFF",
        badge: "Most Picked",
      },
      {
        id: "seylon-tea",
        name: "Seylon Family Blend Tea 400gm",
        image: "trending-seylon-tea.webp",
        price: "205",
        oldPrice: "245",
        discount: "৳40 OFF",
        badge: "Most Picked",
      },
      {
        id: "finlays-tea",
        name: "Finlays Natural Green Tea Bag in Bag 50gm",
        image: "trending-green-tea.webp",
        price: "160",
      },
      {
        id: "pusti-trending",
        name: "Pusti Plus Instant Full Cream Milk Powder 1kg",
        image: "weekday-pusti-milk.webp",
        price: "820",
        oldPrice: "950",
      },
    ],
  },
  {
    title: "UNILEVER WEEK",
    banner: "banner-unilever.webp",
    bannerAlt: "Unilever deals",
    products: [
      {
        id: "tresemme",
        name: "TRESemmé Keratin Smooth Conditioner 215ml",
        image: "unilever-tresemme.webp",
        price: "320",
      },
      {
        id: "dove",
        name: "Dove Intense Repair Conditioner 180ml",
        image: "unilever-dove.webp",
        price: "300",
      },
      {
        id: "closeup",
        name: "CloseUp Ever Fresh Menthol Fresh 150gm",
        image: "unilever-closeup.webp",
        price: "155",
        badge: "Most Picked",
      },
      {
        id: "pepsodent",
        name: "Pepsodent Max Cavity Protection 200gm",
        image: "unilever-pepsodent.webp",
        price: "170",
        badge: "Most Picked",
      },
    ],
  },
  {
    title: "EVERYDAY CLEANING ESSENTIALS",
    products: [
      {
        id: "rin-powder",
        name: "Rin Power Bright Advanced Detergent Powder 1kg",
        image: "clean-rin.webp",
        price: "200",
        badge: "Most Picked",
      },
      {
        id: "wheel-soap",
        name: "Wheel Laundry Soap 125gm",
        image: "clean-wheel-soap.webp",
        price: "35",
        badge: "Most Picked",
      },
      {
        id: "surf-excel",
        name: "Surf Excel 500gm",
        image: "clean-surf.webp",
        price: "130",
        badge: "Most Picked",
      },
      {
        id: "wheel-powder",
        name: "Wheel 2in1 Clean & Fresh Detergent 2kg",
        image: "clean-wheel-powder.webp",
        price: "280",
        badge: "Most Picked",
      },
      {
        id: "domex",
        name: "Domex Lime Fresh Toilet Cleaner 750ml",
        image: "clean-domex.webp",
        price: "180",
      },
    ],
  },
  {
    title: "SNACKS, NOODLES & MORE",
    products: [
      {
        id: "nuggets",
        name: "Golden Harvest Chicken Nuggets 300gm",
        image: "snack-nuggets.webp",
        price: "255",
      },
      {
        id: "noodles",
        name: "Wow! Masala Instant Noodles 496gm",
        image: "snack-noodles.webp",
        price: "111",
        oldPrice: "180",
        discount: "৳69 OFF",
        badge: "Most Picked",
      },
      {
        id: "maggi-noodles",
        name: "Maggi 2 Minute Noodles Masala 8 Pack",
        image: "snack-maggi.webp",
        price: "160",
      },
      {
        id: "golden-harvest-meatball",
        name: "Golden Harvest Chicken Meat Ball 400gm",
        image: "snack-meatball.webp",
        price: "245",
      },
      {
        id: "nugget-alt",
        name: "Golden Harvest Chicken Nuggets",
        image: "snack-nugget-alt.webp",
        price: "245",
      },
    ],
  },
  {
    title: "TRENDING THIS WEEK 🚀",
    products: [
      {
        id: "sunshine-atta",
        name: "Sunshine Atta 2kg",
        image: "trending-atta.webp",
        price: "120",
        oldPrice: "140",
        discount: "৳20 OFF",
        badge: "Most Picked",
      },
      {
        id: "lifebuoy-handwash",
        name: "Lifebuoy Lemon Fresh Hand Wash 1Ltr.",
        image: "trending-lifebuoy.webp",
        price: "450",
        badge: "Most Picked",
      },
      {
        id: "aarong-butter",
        name: "Aarong Dairy Butter 200gm",
        image: "trending-aarong-butter.webp",
        price: "290",
        badge: "Top Seller",
      },
      {
        id: "fresh-atta",
        name: "Fresh Atta 2kg",
        image: "trending-atta-fresh.webp",
        price: "140",
      },
      {
        id: "turmeric-trending",
        name: "Radhuni Turmeric Powder 200gm",
        image: "spice-turmeric.webp",
        price: "130",
      },
    ],
  },
  {
    title: "TODAY’S FEATURED FINDS",
    banner: "banner-featured.webp",
    bannerAlt: "Today's featured finds",
    products: [
      {
        id: "featured-tea",
        name: "Seylon Family Blend Tea 400gm",
        image: "featured-tea.webp",
        price: "205",
        oldPrice: "245",
        discount: "৳40 OFF",
        badge: "Most Picked",
      },
      {
        id: "featured-dano",
        name: "Dano Daily Pusti Milk Powder 500gm",
        image: "featured-dano.webp",
        price: "390",
        oldPrice: "410",
        discount: "৳20 OFF",
        badge: "Most Picked",
      },
      {
        id: "featured-honey",
        name: "Dabur Honey 1kg",
        image: "featured-honey.webp",
        price: "899",
        oldPrice: "990",
        discount: "৳91 OFF",
      },
      {
        id: "featured-wheel",
        name: "Wheel Clean & Fresh 2in1 Detergent Powder 500gm",
        image: "clean-wheel-powder.webp",
        price: "85",
      },
      {
        id: "featured-vim",
        name: "Vim Dish Wash Bar",
        image: "clean-wheel-soap.webp",
        price: "40",
      },
    ],
  },
  {
    title: "✨ SPICE UP YOUR COOKING GAME",
    products: [
      {
        id: "cumin",
        name: "Radhuni Cumin (Jeera) Powder 100gm",
        image: "spice-cumin.webp",
        price: "160",
        badge: "Most Picked",
      },
      {
        id: "coriander",
        name: "ACI Pure Coriander (Dhonia) Powder 200gm",
        image: "spice-coriander.webp",
        price: "80",
        oldPrice: "110",
        discount: "৳30 OFF",
        badge: "Most Picked",
      },
      {
        id: "turmeric",
        name: "Radhuni Turmeric (Holud) Powder 200gm",
        image: "spice-turmeric.webp",
        price: "130",
        badge: "Most Picked",
      },
      {
        id: "cloves",
        name: "Shwapno Labongo (Cloves) 25gm",
        image: "spice-cloves.webp",
        price: "80",
      },
      {
        id: "oregano",
        name: "Haiko Oregano Pizza 10gm",
        image: "spice-oregano.webp",
        price: "95",
      },
    ],
  },
  {
    title: "BODY SPRAY & PERFUME",
    products: [
      {
        id: "enchanteur-spray",
        name: "Enchanteur Stunning Body Spray 150ml",
        image: "spray-enchanteur.webp",
        price: "399",
        oldPrice: "450",
        discount: "৳51 OFF",
      },
      {
        id: "realman-spray",
        name: "Real Man Fresh Spirit Body Spray 150ml",
        image: "spray-realman.webp",
        price: "450",
      },
      {
        id: "enchanteur-perfume",
        name: "Enchanteur Charming Perfume 18ml",
        image: "spray-perfume.webp",
        price: "250",
      },
      {
        id: "enchanteur-chic",
        name: "Enchanteur Chic EDS Dreamy Twinkle 100ml",
        image: "spray-enchanteur-chic.webp",
        price: "1,200",
      },
      {
        id: "realman-fresh",
        name: "Real Man Fresh Mood Body Spray 150ml",
        image: "spray-realman-fresh.webp",
        price: "450",
      },
    ],
  },
  {
    title: "FRESH VEGETABLES",
    products: [
      {
        id: "brinjal",
        name: "Lomba Begun-Beguni (Brinjal Long)",
        image: "vegetable-brinjal.webp",
        price: "80",
        unit: "Per 1kg",
      },
      {
        id: "green-chilli",
        name: "Kacha Morich (Chilli Green)",
        image: "vegetable-chilli.webp",
        price: "60",
        unit: "Per 1kg",
      },
      {
        id: "round-lemon",
        name: "Lebu Gol (Lemon Round)",
        image: "vegetable-lemon-round.webp",
        price: "12",
        unit: "Per Piece",
      },
      {
        id: "cauliflower",
        name: "Fulcopy (Cauliflower)",
        image: "vegetable-cauliflower.webp",
        price: "40",
        unit: "Per Piece",
      },
      {
        id: "long-lemon",
        name: "Lomba Lebu (Lemon Long)",
        image: "vegetable-lemon-long.webp",
        price: "10",
        unit: "Per Piece",
      },
    ],
  },
  {
    title: "DIABETIC CORNER",
    products: [
      {
        id: "zerocal",
        name: "Zerocal Stevia Sachets 75 Pack",
        image: "diabetic-zerocal.webp",
        price: "250",
      },
      {
        id: "sugar-free-biscuit",
        name: "Kishwan Sugar Free Biscuit 300gm",
        image: "diabetic-biscuit.webp",
        price: "170",
      },
      {
        id: "marks-diabetic",
        name: "MARKS Milk Based Diabetic Diet 400gm",
        image: "diabetic-marks.webp",
        price: "1,400",
      },
      {
        id: "suito",
        name: "Suito Calorie & Fat Free Sweetener 50 Sachet",
        image: "diabetic-suito.webp",
        price: "175",
      },
      {
        id: "zerocal-30",
        name: "Zero Cal Stevia 30 Sachets",
        image: "diabetic-zerocal30.webp",
        price: "120",
      },
    ],
  },
];

const weekdayTabs = [
  "Full Cream Milk",
  "Regular Spice",
  "Soft Drinks",
  "Frozen Snacks Others",
  "Ice Cream",
  "Noodles",
  "Candy & Chocolate",
  "Juice",
];

const weekdayCollections: Record<string, Product[]> = {
  "Full Cream Milk": shelves[0].products,
  "Regular Spice": shelves.find((shelf) => shelf.title.includes("SPICE"))?.products ?? [],
  "Soft Drinks": [
    {
      id: "fresh-club-soda",
      name: "Fresh Club 9 Soda 500ml",
      image: "weekday-soda.webp",
      price: "25",
      oldPrice: "30",
      discount: "৳5 OFF",
    },
    {
      id: "fresh-cola",
      name: "Fresh Cola Drink Pet 1Ltr.",
      image: "weekday-cola.webp",
      price: "40",
      oldPrice: "60",
      discount: "৳20 OFF",
      badge: "Most Picked",
    },
    {
      id: "fresh-up",
      name: "Fresh Up Drink Pet 1Ltr.",
      image: "weekday-up.webp",
      price: "45",
      oldPrice: "60",
      discount: "৳15 OFF",
      badge: "Most Picked",
    },
    {
      id: "coca-cola",
      name: "Coca Cola 1.75Ltr. Pet Bottle",
      image: "weekday-cocacola.webp",
      price: "135",
      oldPrice: "150",
      discount: "৳15 OFF",
    },
    {
      id: "sprite",
      name: "Sprite 1.75Ltr. Pet Bottle",
      image: "weekday-sprite.webp",
      price: "135",
      oldPrice: "150",
      discount: "৳15 OFF",
    },
  ],
  "Frozen Snacks Others": [
    {
      id: "spring-roll",
      name: "Golden Harvest Chicken Spring Roll 300gm",
      image: "weekday-spring-roll.webp",
      price: "225",
      oldPrice: "250",
      discount: "৳25 OFF",
    },
    {
      id: "pop-chicken",
      name: "Golden Harvest Pop Chicken 250gm",
      image: "weekday-pop-chicken.webp",
      price: "243",
      oldPrice: "270",
      discount: "৳27 OFF",
    },
    {
      id: "weekday-meatball",
      name: "Golden Harvest Chicken Meat Ball 400gm",
      image: "weekday-meatball.webp",
      price: "240",
    },
    {
      id: "chicken-strips",
      name: "Golden Harvest Chicken Strips 300gm",
      image: "weekday-strips.webp",
      price: "280",
    },
  ],
  "Ice Cream": [
    {
      id: "igloo-ego",
      name: "Igloo Ego Ice Cream 75ml",
      image: "weekday-igloo-ego.webp",
      price: "70",
      oldPrice: "100",
      discount: "৳30 OFF",
    },
    {
      id: "igloo-cornelli",
      name: "Igloo Cornelli Belgian Chocolate Cone 100ml",
      image: "weekday-igloo-cone.webp",
      price: "55.30",
      oldPrice: "70",
      discount: "৳14.70 OFF",
      badge: "Top Seller",
    },
    {
      id: "igloo-black-forest",
      name: "Igloo Black Forest Ice Cream 120ml",
      image: "weekday-igloo-forest.webp",
      price: "90",
    },
  ],
  Noodles: shelves.find((shelf) => shelf.title === "SNACKS, NOODLES & MORE")?.products ?? [],
  "Candy & Chocolate": [
    {
      id: "lotte-blueberry-gum",
      name: "Lotte Xylitol Blueberry Mint Gum 55.1gm",
      image: "weekday-lotte-blueberry.webp",
      price: "280",
      oldPrice: "330",
      discount: "৳50 OFF",
    },
    {
      id: "lotte-lime-gum",
      name: "Lotte Xylitol Lime Mint Gum 55.1gm",
      image: "weekday-lotte-lime.webp",
      price: "280",
      oldPrice: "330",
      discount: "৳50 OFF",
    },
  ],
  Juice: [],
};

const trustItems = [
  {
    image: "trust-delivery.png",
    title: "60 Mins Delivery",
    detail: "Free shipping over 1500Tk",
  },
  {
    image: "trust-authorized.png",
    title: "Authorized Products",
    detail: "within 30 days for an exchange",
  },
  {
    image: "trust-support.png",
    title: "Customer Service Support",
    detail: "8am to 10pm",
  },
  {
    image: "trust-payments.png",
    title: "Flexible Payments",
    detail: "Pay with multiple credit cards",
  },
];

const brands = [
  ["Shwapno", "brand-shwapno.png"],
  ["ACI", "brand-aci.webp"],
  ["Unilever", "brand-unilever.webp"],
  ["Himalaya", "brand-himalaya.png"],
  ["Nestle", "brand-nestle.png"],
  ["Marico", "brand-marico.webp"],
  ["Square", "brand-square.png"],
  ["MGI", "brand-mgi.webp"],
] as const;

const coverage = [
  ["Dhaka", "323 outlets"],
  ["Chattogram", "25 outlets"],
  ["Cumilla", "37 outlets"],
  ["Manikganj", "14 outlets"],
  ["Sylhet", "26 outlets"],
  ["Khulna", "20 outlets"],
  ["Gazipur", "75 outlets"],
  ["Barishal", "38 outlets"],
];

const allProducts = Array.from(
  new Map(
    [
      ...recommended,
      ...shelves.flatMap((shelf) => shelf.products),
      ...Object.values(weekdayCollections).flat(),
    ].map((product) => [product.id, product] as const),
  ).values(),
);

function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (product: Product) => void;
}) {
  return (
    <article className="shwapno-product-card">
      {product.discount && <span className="shwapno-product-offer">{product.discount}</span>}
      {product.badge && <span className="shwapno-product-badge">{product.badge}</span>}
      <div className="shwapno-product-picture">
        <Image
          src={`${ASSET}${product.image}`}
          alt={product.name}
          width={220}
          height={190}
          sizes="(max-width: 640px) 48vw, (max-width: 1024px) 25vw, 18vw"
        />
        <button
          className="shwapno-product-plus"
          type="button"
          aria-label={`Add ${product.name} to bag`}
          onClick={() => onAdd(product)}
        >
          <Plus aria-hidden="true" size={18} />
        </button>
      </div>
      <p className="shwapno-delivery-time">Delivery 1-2 hours</p>
      <h3>{product.name}</h3>
      <div className="shwapno-product-price">
        {product.oldPrice && <del>৳{product.oldPrice}</del>}
        <strong>৳{product.price}</strong>
        <span>{product.unit ?? "Per Piece"}</span>
      </div>
      <button className="shwapno-add-button" type="button" onClick={() => onAdd(product)}>
        <Plus aria-hidden="true" size={15} />
        Add to Bag
      </button>
    </article>
  );
}

function ProductShelf({
  title,
  products,
  banner,
  bannerAlt,
  accent,
  onAdd,
}: Shelf & { onAdd: (product: Product) => void }) {
  const railRef = useRef<HTMLDivElement>(null);

  const moveRail = (direction: -1 | 1) => {
    railRef.current?.scrollBy({
      left: direction * Math.max(280, railRef.current.clientWidth * 0.8),
      behavior: "smooth",
    });
  };

  return (
    <section className={`shwapno-shelf ${accent ? `shwapno-shelf-${accent}` : ""}`}>
      {banner && (
        <a
          className="shwapno-shelf-banner"
          href="https://www.shwapno.com/"
          aria-label={bannerAlt ?? title}
        >
          <Image
            src={`${ASSET}${banner}`}
            alt={bannerAlt ?? title}
            width={1200}
            height={300}
            sizes="(max-width: 767px) 100vw, 92vw"
          />
        </a>
      )}
      <div className="shwapno-shelf-heading">
        <h2>{title}</h2>
        <div className="shwapno-shelf-controls">
          <a href="https://www.shwapno.com/deals">View All</a>
          <button type="button" aria-label={`Previous ${title} products`} onClick={() => moveRail(-1)}>
            <ChevronLeft aria-hidden="true" size={17} />
          </button>
          <button type="button" aria-label={`Next ${title} products`} onClick={() => moveRail(1)}>
            <ChevronRight aria-hidden="true" size={17} />
          </button>
        </div>
      </div>
      <div className="shwapno-product-rail" ref={railRef}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={onAdd} />
        ))}
      </div>
    </section>
  );
}

export function ShwapnoHome() {
  const router = useRouter();
  const [activeHero, setActiveHero] = useState(1);
  const [activeWeekdayTab, setActiveWeekdayTab] = useState(weekdayTabs[0]);
  const brandRailRef = useRef<HTMLDivElement>(null);
  const [promoOpen, setPromoOpen] = useState(true);
  const [activePopupSlide, setActivePopupSlide] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [locationOpen, setLocationOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [language, setLanguage] = useState<"বাংলা" | "English">("বাংলা");
  const [search, setSearch] = useState("");
  const [activeDepartment, setActiveDepartment] = useState("");
  const [bag, setBag] = useState<Record<string, number>>({});
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [timer, setTimer] = useState(25 * 60 + 59);

  const searchResults = useMemo(() => {
    const query = search.trim().toLowerCase();
    return query
      ? allProducts.filter((product) => product.name.toLowerCase().includes(query)).slice(0, 5)
      : [];
  }, [search]);

  const bagItems = Object.entries(bag).flatMap(([id, quantity]) => {
    const product = allProducts.find((item) => item.id === id);
    return product && quantity > 0 ? [product] : [];
  });
  const bagCount = Object.values(bag).reduce((sum, quantity) => sum + quantity, 0);
  const weekdayProducts = weekdayCollections[activeWeekdayTab];

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTimer((current) => (current === 0 ? 24 * 60 * 60 - 1 : current - 1));
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  const addToBag = (product: Product) => {
    setBag((current) => ({
      ...current,
      [product.id]: (current[product.id] ?? 0) + (product.id === "egg-loose" && !current[product.id] ? 12 : 1),
    }));
  };

  const changeBagQuantity = (productId: string, change: number) => {
    setBag((current) => {
      const quantity = (current[productId] ?? 0) + change;
      if (quantity <= 0) {
        const remaining = { ...current };
        delete remaining[productId];
        return remaining;
      }
      return { ...current, [productId]: quantity };
    });
  };

  const removeFromBag = (productId: string) => {
    setBag((current) => {
      const remaining = { ...current };
      delete remaining[productId];
      return remaining;
    });
  };

  const bagTotal = bagItems.reduce(
    (total, product) => total + Number(product.price) * bag[product.id],
    0,
  );

  const placeOrder = () => {
    const checkoutItems: ShwapnoCheckoutItem[] = bagItems.map((product) => ({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: bag[product.id],
    }));

    try {
      window.localStorage.setItem(
        SHWAPNO_CHECKOUT_STORAGE_KEY,
        JSON.stringify(checkoutItems),
      );
      setCheckoutError("");
      setCartOpen(false);
      router.push("/checkout");
    } catch (error) {
      console.error("Unable to save the Shwapno checkout basket.", error);
      setCheckoutError("We couldn't continue to checkout. Please try again.");
    }
  };

  const formatTaka = (amount: number) =>
    Number.isInteger(amount) ? String(amount) : amount.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");

  const applyCoupon = () => {
    setCouponMessage(
      couponCode.trim()
        ? "This coupon code is not available."
        : "Please enter a coupon code.",
    );
  };

  const moveHero = (direction: -1 | 1) => {
    setActiveHero((current) => (current + direction + heroSlides.length) % heroSlides.length);
  };

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (search.trim()) {
      document.getElementById("recommended")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const onSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") setSearch("");
  };

  const formatTimer = (value: number) => {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = value % 60;
    return `01 : ${String(hours).padStart(2, "0")} : ${String(minutes).padStart(2, "0")} : ${String(seconds).padStart(2, "0")}`;
  };

  const categoryList = (
    <div className="shwapno-department-list">
      {departments.map((department, index) => (
        <button
          className={activeDepartment === department ? "is-selected" : ""}
          key={department}
          type="button"
          onClick={() =>
            setActiveDepartment((current) => (current === department ? "" : department))
          }
        >
          <span className={`shwapno-department-icon department-icon-${index}`} aria-hidden="true">
            {["◈", "◌", "▱", "⌂", "◇", "✳", "▤", "⌂", "▦", "◇", "▣"][index]}
          </span>
          <span>{department}</span>
          <ChevronRight aria-hidden="true" size={16} />
        </button>
      ))}
    </div>
  );

  return (
    <main className="shwapno-site">
      <div className="shwapno-app-promo">
        <a href="https://www.shwapno.com/" aria-label="Download the Shwapno app">
          <Image
            src={`${ASSET}app-download-mobile.png`}
            alt="Shwapno App — Download Now"
            width={240}
            height={26}
            priority
          />
        </a>
      </div>

      <header className="shwapno-header">
        <div className="shwapno-header-main">
          <button
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            className="shwapno-mobile-menu-toggle"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
          <a className="shwapno-logo" href="https://www.shwapno.com/" aria-label="Shwapno home">
            <Image
              src={`${ASSET}shwapno-logo.png`}
              alt="Shwapno"
              width={116}
              height={55}
              priority
            />
          </a>

          <button
            className="shwapno-location-button"
            type="button"
            onClick={() => setLocationOpen(true)}
          >
            <Truck aria-hidden="true" size={21} />
            <span>{selectedLocation || "Select your delivery location"}</span>
            <ChevronDown aria-hidden="true" size={16} />
          </button>

          <form className="shwapno-search" onSubmit={onSearch} role="search">
            <input
              aria-label="Search your products"
              placeholder="Search your products"
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              onKeyDown={onSearchKeyDown}
            />
            <button type="submit" aria-label="Search">
              <Search aria-hidden="true" size={22} />
            </button>
            {search && (
              <div className="shwapno-search-results">
                {searchResults.length ? (
                  searchResults.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => {
                        setSearch(product.name);
                        document
                          .getElementById("recommended")
                          ?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                    >
                      <Image
                        src={`${ASSET}${product.image}`}
                        alt=""
                        width={40}
                        height={40}
                      />
                      <span>{product.name}</span>
                      <strong>৳{product.price}</strong>
                    </button>
                  ))
                ) : (
                  <p>No products found</p>
                )}
              </div>
            )}
          </form>

          <a className="shwapno-app-download" href="https://www.shwapno.com/">
            <Image
              src={`${ASSET}app-download.png`}
              alt="Download the Shwapno app"
              width={131}
              height={30}
            />
          </a>
          <button
            className="shwapno-language"
            type="button"
            onClick={() => setLanguage((current) => (current === "বাংলা" ? "English" : "বাংলা"))}
          >
            {language}
          </button>
          <button
            className="shwapno-account-button"
            type="button"
            onClick={() => setAccountOpen(true)}
          >
            <UserRound aria-hidden="true" size={19} />
            <span>Sign in / Sign up</span>
          </button>
          <button className="shwapno-more-button" type="button" aria-label="More options">
            ⋮
          </button>
        </div>

        <nav className="shwapno-nav" aria-label="Main navigation">
          <button
            className="shwapno-shop-category"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Menu aria-hidden="true" size={17} />
            <span>SHOP BY CATEGORY</span>
          </button>
          <div className="shwapno-quick-links">
            {quickLinks.map(([label, path]) => (
              <a key={label} href={`https://www.shwapno.com${path}`}>
                {label}
              </a>
            ))}
          </div>
          <div className="shwapno-utility-links">
            <a href="https://www.shwapno.com/our-outlets">
              <MapPin aria-hidden="true" size={13} />
              Our outlets
            </a>
            <a href="https://www.shwapno.com/helpline">
              <CircleHelp aria-hidden="true" size={13} />
              Help line
            </a>
          </div>
        </nav>
      </header>

      {menuOpen && <button className="shwapno-menu-backdrop" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}
      {menuOpen && <aside className="shwapno-mobile-menu">{categoryList}</aside>}

      <section className={`shwapno-top-layout${menuOpen ? " is-menu-collapsed" : ""}`}>
        <aside
          className={`shwapno-desktop-departments${menuOpen ? " is-collapsed" : ""}`}
          aria-label="Shop by category"
        >
          {categoryList}
        </aside>
        <div className="shwapno-top-content">
          <div className="shwapno-mobile-quick-links">
            {quickLinks.map(([label, path]) => (
              <a key={label} href={`https://www.shwapno.com${path}`}>
                {label}
              </a>
            ))}
          </div>

          <section className="shwapno-hero" aria-label="Featured campaigns">
            <a
              className="shwapno-hero-image"
              href={`https://www.shwapno.com${heroSlides[activeHero].href}`}
              aria-label={heroSlides[activeHero].alt}
            >
              <Image
                src={`${ASSET}${heroSlides[activeHero].image}`}
                alt={heroSlides[activeHero].alt}
                width={1200}
                height={600}
                priority
                sizes="(max-width: 767px) 100vw, 80vw"
              />
            </a>
            <button
              className="shwapno-hero-arrow hero-arrow-left"
              type="button"
              aria-label="Previous promotion"
              onClick={() => moveHero(-1)}
            >
              <ChevronLeft aria-hidden="true" size={24} />
            </button>
            <button
              className="shwapno-hero-arrow hero-arrow-right"
              type="button"
              aria-label="Next promotion"
              onClick={() => moveHero(1)}
            >
              <ChevronRight aria-hidden="true" size={24} />
            </button>
            <div className="shwapno-hero-dots" aria-label="Choose promotion">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.image}
                  type="button"
                  aria-label={`Show ${slide.alt}`}
                  aria-current={index === activeHero}
                  onClick={() => setActiveHero(index)}
                />
              ))}
            </div>
          </section>

          <div className="shwapno-category-rail" aria-label="Popular categories">
            {categories.map((category) => (
              <a
                className="shwapno-category-card"
                href={`https://www.shwapno.com/search?q=${encodeURIComponent(category.name)}`}
                key={category.name}
              >
                <Image
                  src={`${ASSET}${category.image}`}
                  alt=""
                  width={230}
                  height={190}
                  sizes="(max-width: 640px) 40vw, (max-width: 1024px) 24vw, 15vw"
                />
                <span>{category.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="shwapno-trust-strip" aria-label="Shopping benefits">
        {trustItems.map((item) => (
          <div className="shwapno-trust-item" key={item.title}>
            <Image
              src={`${ASSET}${item.image}`}
              alt=""
              width={44}
              height={44}
            />
            <div>
              <strong>{item.title}</strong>
              <span>{item.detail}</span>
            </div>
          </div>
        ))}
      </section>

      <div className="shwapno-home-content">
        <section className="shwapno-recommended" id="recommended">
          <div className="shwapno-shelf-heading">
            <h2>RECOMMENDED FOR YOU</h2>
            <div className="shwapno-shelf-controls">
              <button
                type="button"
                aria-label="Previous recommended products"
                onClick={() =>
                  document
                    .getElementById("recommended-products")
                    ?.scrollBy({ left: -500, behavior: "smooth" })
                }
              >
                <ChevronLeft aria-hidden="true" size={17} />
              </button>
              <button
                type="button"
                aria-label="Next recommended products"
                onClick={() =>
                  document
                    .getElementById("recommended-products")
                    ?.scrollBy({ left: 500, behavior: "smooth" })
                }
              >
                <ChevronRight aria-hidden="true" size={17} />
              </button>
            </div>
          </div>
          <div className="shwapno-product-rail" id="recommended-products">
            {recommended.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={addToBag} />
            ))}
          </div>
        </section>

        <section className="shwapno-weekday-section">
          <div className="shwapno-weekday-title">
            <h2>WEEKDAY DEALS!!!</h2>
            <span>{formatTimer(timer)} LEFT</span>
          </div>
          <div className="shwapno-weekday-tabs">
            {weekdayTabs.map((label) => (
              <button
                className={activeWeekdayTab === label ? "is-active" : ""}
                type="button"
                key={label}
                aria-pressed={activeWeekdayTab === label}
                onClick={() => setActiveWeekdayTab(label)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="shwapno-weekday-products">
            {weekdayProducts.length ? (
              weekdayProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={addToBag} />
              ))
            ) : (
              <p className="shwapno-weekday-empty">No current offers in this category.</p>
            )}
          </div>
        </section>

        {shelves.slice(1).map((shelf) => (
          <ProductShelf key={shelf.title} {...shelf} onAdd={addToBag} />
        ))}

        <section className="shwapno-food-promos" aria-label="More offers">
          <div className="shwapno-promo-stack">
            <a href="https://www.shwapno.com/fresh-food">
              <Image
                src={`${ASSET}promo-fresh-meat.jpeg`}
                alt="Fresh meat"
                width={500}
                height={180}
              />
            </a>
            <a href="https://www.shwapno.com/fish">
              <Image
                src={`${ASSET}promo-fresh-fish.jpeg`}
                alt="Fresh fish"
                width={500}
                height={180}
              />
            </a>
          </div>
          <a className="shwapno-promo-featured" href="https://www.shwapno.com/deals">
            <Image
              src={`${ASSET}promo-gadget.jpeg`}
              alt="Stock up on essentials"
              width={1000}
              height={500}
            />
          </a>
        </section>

        <section className="shwapno-brand-section">
          <div className="shwapno-shelf-heading">
            <h2>OUR BRANDS</h2>
            <div className="shwapno-shelf-controls">
              <button
                type="button"
                aria-label="Previous brands"
                onClick={() => brandRailRef.current?.scrollBy({ left: -500, behavior: "smooth" })}
              >
                <ChevronLeft aria-hidden="true" size={17} />
              </button>
              <button
                type="button"
                aria-label="Next brands"
                onClick={() => brandRailRef.current?.scrollBy({ left: 500, behavior: "smooth" })}
              >
                <ChevronRight aria-hidden="true" size={17} />
              </button>
            </div>
          </div>
          <div className="shwapno-brand-rail" ref={brandRailRef}>
            {brands.map(([name, image]) => (
              <a href="https://www.shwapno.com/brands" key={name}>
                <Image src={`${ASSET}${image}`} alt={name} width={120} height={95} />
                <span>{name}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="shwapno-coverage-section">
          <a className="shwapno-bottom-banner" href="https://www.shwapno.com/deals">
            <Image
              src={`${ASSET}banner-bottom.webp`}
              alt="Affordable Monthly Grocery Deals"
              width={1200}
              height={360}
            />
          </a>
          <div className="shwapno-coverage">
            <h2>Shwapno Coverage area</h2>
            <div className="shwapno-coverage-list">
              {coverage.map(([city, outlets]) => (
                <div key={city}>
                  <span>{city}</span>
                  <strong>{outlets}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <footer className="shwapno-footer">
        <div className="shwapno-footer-about">
          <Image src={`${ASSET}shwapno-logo.png`} alt="Shwapno" width={116} height={55} />
          <strong>Always Here for You</strong>
          <span>Call Us: 16469 (8am-10pm, Everyday)</span>
          <span>Email Us: queries@acilogistics.net</span>
          <span>ACI SHWAPNO E-COMMERCE LIMITED</span>
        </div>
        <div>
          <h2>Information</h2>
          <a href="https://www.shwapno.com/our-outlets">Office Address</a>
          <a href="https://www.shwapno.com/shipping-returns">Shipping &amp; returns</a>
          <a href="https://www.shwapno.com/about-us">About us</a>
          <a href="https://www.shwapno.com/terms-and-conditions">Terms &amp; Condition</a>
        </div>
        <div>
          <h2>Customer Service</h2>
          <a href="https://www.shwapno.com/helpline">Contact Us</a>
        </div>
        <div>
          <h2>My Account</h2>
          <button type="button" onClick={() => setAccountOpen(true)}>
            Sign in / Sign up
          </button>
        </div>
        <div className="shwapno-footer-social">
          <h2>Pay With</h2>
          <div className="shwapno-payment-badges">
            <span>VISA</span>
            <span>mastercard</span>
            <span>AMEX</span>
            <span>bkash</span>
          </div>
          <h2>Follow Us</h2>
          <a href="https://www.facebook.com/ShwapnoSuperstore">f</a>
          <a href="https://www.youtube.com/">▶</a>
        </div>
        <small>Copyright © 2026</small>
      </footer>

      <button
        className="shwapno-chat-button"
        type="button"
        aria-label="Open shopping assistant"
        onClick={() => setAccountOpen(true)}
      >
        <Sparkles aria-hidden="true" size={23} />
      </button>

      <button className="shwapno-floating-cart" type="button" onClick={() => setCartOpen(true)}>
        <ShoppingBasket aria-hidden="true" size={25} />
        <span>{bagCount} items</span>
        <strong>৳0</strong>
      </button>

      <nav className="shwapno-mobile-dock" aria-label="Quick actions">
        <button type="button" onClick={() => setLocationOpen(true)}>
          <MapPin aria-hidden="true" size={21} />
          <span>Select your delivery location</span>
        </button>
        <button className="mobile-dock-cart" type="button" onClick={() => setCartOpen(true)}>
          <ShoppingBasket aria-hidden="true" size={22} />
          <span>{bagCount}</span>
        </button>
        <button type="button" onClick={() => setLocationOpen(true)}>
          <Truck aria-hidden="true" size={22} />
          <span>
            Today:
            <strong>7PM - 8PM</strong>
          </span>
        </button>
      </nav>

      {locationOpen && (
        <div className="shwapno-modal-backdrop" onMouseDown={() => setLocationOpen(false)}>
          <section
            className="shwapno-modal shwapno-location-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="location-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="shwapno-modal-close" type="button" aria-label="Close" onClick={() => setLocationOpen(false)}>
              <X size={19} />
            </button>
            <h2 id="location-title">Select your delivery location</h2>
            <p>Choose your city to see delivery availability and time slots.</p>
            {["Dhaka", "Chattogram", "Cumilla", "Sylhet"].map((city) => (
              <button
                className="shwapno-location-option"
                key={city}
                type="button"
                onClick={() => {
                  setSelectedLocation(city);
                  setLocationOpen(false);
                }}
              >
                <MapPin size={17} />
                {city}
                <ChevronRight className="location-chevron" size={17} />
              </button>
            ))}
          </section>
        </div>
      )}

      {cartOpen && (
        <div className="shwapno-cart-backdrop" onMouseDown={() => setCartOpen(false)}>
          <aside
            className="shwapno-cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="shwapno-cart-drawer-head">
              <h2 id="cart-title">
                <ShoppingBasket aria-hidden="true" size={24} />
                <span>{bagItems.length} items</span>
              </h2>
              <button type="button" aria-label="Close cart" onClick={() => setCartOpen(false)}>
                <X aria-hidden="true" size={18} />
                <span>Close</span>
              </button>
            </div>
            {bagItems.length > 0 && (
              <section className="shwapno-delivery-progress" aria-label="Delivery savings">
                <strong>Shop ৳{formatTaka(Math.max(0, 400 - bagTotal))} more to save ৳10 on delivery</strong>
                <div className="shwapno-progress-track">
                  <span className="shwapno-progress-fill" />
                  <span className="shwapno-progress-label progress-start">৳49</span>
                  <span className="shwapno-progress-label progress-current">৳39</span>
                  <span className="shwapno-progress-label progress-end">৳0</span>
                </div>
              </section>
            )}
            {bagItems.length ? (
              <div className="shwapno-cart-items">
                {bagItems.map((product) => (
                  <div className="shwapno-cart-line" key={product.id}>
                    <Image src={`${ASSET}${product.image}`} alt="" width={54} height={54} />
                    <div className="shwapno-cart-product">
                      <strong>{product.name}</strong>
                      <div className="shwapno-cart-product-bottom">
                        <div className="shwapno-cart-prices">
                          <strong>৳{formatTaka(Number(product.price) * bag[product.id])}</strong>
                          <span>৳{formatTaka(Number(product.price))} <i aria-hidden="true">|</i> Piece</span>
                        </div>
                        <div className="shwapno-cart-controls">
                          <button
                            type="button"
                            aria-label={`Remove ${product.name}`}
                            onClick={() => removeFromBag(product.id)}
                          >
                            <Trash2 aria-hidden="true" size={15} />
                          </button>
                          <button
                            className="quantity-button"
                            type="button"
                            aria-label={`Decrease ${product.name} quantity`}
                            onClick={() => changeBagQuantity(product.id, -1)}
                          >
                            <Minus aria-hidden="true" size={18} />
                          </button>
                          <span aria-live="polite">{bag[product.id]}</span>
                          <button
                            className="quantity-button"
                            type="button"
                            aria-label={`Increase ${product.name} quantity`}
                            onClick={() => changeBagQuantity(product.id, 1)}
                          >
                            <Plus aria-hidden="true" size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="shwapno-empty-cart">
                <ShoppingBasket size={45} />
                <p>Looks like Your cart is empty.</p>
                <span>Start shopping</span>
              </div>
            )}
            {bagItems.length > 0 && (
              <div className="shwapno-cart-footer">
                <form
                  className="shwapno-cart-coupon"
                  onSubmit={(event) => {
                    event.preventDefault();
                    applyCoupon();
                  }}
                >
                  <label className="sr-only" htmlFor="cart-coupon-code">Coupon code</label>
                  <input
                    id="cart-coupon-code"
                    placeholder="Type your coupon code"
                    value={couponCode}
                    onChange={(event) => {
                      setCouponCode(event.currentTarget.value);
                      setCouponMessage("");
                    }}
                  />
                  <button type="submit">Apply coupon</button>
                  {couponMessage && <span role="status">{couponMessage}</span>}
                </form>
                <div className="shwapno-cart-actions">
                  <div>Total: <s>৳{formatTaka(bagTotal)}</s></div>
                  <button
                    type="button"
                    onClick={placeOrder}
                  >
                    Place Order
                  </button>
                </div>
                {checkoutError && <p className="shwapno-cart-checkout-error" role="alert">{checkoutError}</p>}
              </div>
            )}
          </aside>
        </div>
      )}

      {accountOpen && (
        <div className="shwapno-modal-backdrop" onMouseDown={() => setAccountOpen(false)}>
          <section
            className="shwapno-modal shwapno-account-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="shwapno-modal-close" type="button" aria-label="Close" onClick={() => setAccountOpen(false)}>
              <X size={19} />
            </button>
            <UserRound size={32} />
            <h2 id="account-title">Sign in to Shwapno</h2>
            <p>You’ll need to log in to continue.</p>
            <label>
              Mobile number
              <input inputMode="tel" placeholder="Enter your mobile number" />
            </label>
            <button className="shwapno-checkout-button" type="button">
              Continue
            </button>
          </section>
        </div>
      )}

      {promoOpen && (
        <div className="shwapno-popup-overlay" onMouseDown={() => setPromoOpen(false)}>
          <section
            className="shwapno-popup-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Featured promotion"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <Image
              src={`${ASSET}${popupSlides[activePopupSlide].image}`}
              alt={popupSlides[activePopupSlide].alt}
              width={1000}
              height={600}
              priority
            />
            {activePopupSlide > 0 && (
              <button
                className="shwapno-popup-arrow popup-arrow-left"
                type="button"
                aria-label="Previous slide"
                onClick={() => setActivePopupSlide((slide) => slide - 1)}
              >
                <ChevronLeft aria-hidden="true" size={24} />
              </button>
            )}
            {activePopupSlide < popupSlides.length - 1 && (
              <button
                className="shwapno-popup-arrow popup-arrow-right"
                type="button"
                aria-label="Next slide"
                onClick={() => setActivePopupSlide((slide) => slide + 1)}
              >
                <ChevronRight aria-hidden="true" size={24} />
              </button>
            )}
            <button
              className="shwapno-popup-close"
              type="button"
              aria-label="Close popup"
              onClick={() => setPromoOpen(false)}
            >
              <X aria-hidden="true" size={23} />
            </button>
          </section>
        </div>
      )}
    </main>
  );
}

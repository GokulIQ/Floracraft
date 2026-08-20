/* ==========================================================================
   FLORACRAFT - CENTRAL MOCK DATASTORE
   Products, Categories, Plant Care Guides, Testimonials, FAQ & Team
   ========================================================================== */

const FLORACRAFT_DATA = {
  categories: [
    {
      id: "indoor-plants",
      name: "Indoor Plants",
      slug: "indoor-plants",
      count: 5,
      image: "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80",
      description: "Air-purifying, low-light, and lush greenery for homes & workspaces."
    },
    {
      id: "outdoor-plants",
      name: "Outdoor Plants",
      slug: "outdoor-plants",
      count: 3,
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80",
      description: "Hardy perennials, blooming shrubs, and sun-loving garden plants."
    },
    {
      id: "flower-pots",
      name: "Flower Pots",
      slug: "flower-pots",
      count: 3,
      image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80",
      description: "Handcrafted terracotta, ceramic glazed, and modern hanging pots."
    },
    {
      id: "seeds",
      name: "Seeds",
      slug: "seeds",
      count: 2,
      image: "https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=600&q=80",
      description: "Heirloom flower seeds and fast-growing giant sunflower seeds."
    },
    {
      id: "soil-fertilizers",
      name: "Soil & Fertilizers",
      slug: "soil-fertilizers",
      count: 3,
      image: "assets/images/blog/soil-aeration.jpg",
      description: "Organic bio-active potting mixes, liquid kelp, and neem cake."
    },
    {
      id: "gardening-tools",
      name: "Gardening Tools",
      slug: "gardening-tools",
      count: 3,
      image: "https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=600&q=80",
      description: "Ergonomic stainless trowels, Japanese steel shears, and watering cans."
    },
    {
      id: "plant-accessories",
      name: "Plant Accessories",
      slug: "plant-accessories",
      count: 1,
      image: "https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=600&q=80",
      description: "Bamboo plant stands, supports, moss poles, and indoor display risers."
    }
  ],

  products: [
    {
      id: "prod-1",
      name: "Peace Lily Plant",
      category: "indoor-plants",
      categoryName: "Indoor Plants",
      price: 28.00,
      oldPrice: 35.00,
      discount: "20% OFF",
      rating: 4.8,
      reviewsCount: 94,
      badge: "Air Purifier",
      badgeType: "organic",
      inStock: true,
      stockQty: 30,
      isFeatured: true,
      isSeasonal: false,
      light: "Low to Medium Indirect",
      water: "Weekly",
      petFriendly: false,
      airPurifying: true,
      difficulty: "Beginner Friendly",
      sku: "FC-PEA-01",
      tags: ["indoor", "peace lily", "flowering", "air-purifying", "low-light", "spathiphyllum"],
      images: [
        "assets/images/Peace_Lily_Plant_2K_202608190648.jpeg",
        "assets/images/Peace_Lily_Plant_2K_202608190648 (1).jpeg",
        "assets/images/Peace_Lily_Plant_2K_202608190648 (2).jpeg"
      ],
      description: "Glossy dark green foliage with graceful white spathe flowers that bloom year-round. Peace Lily is an organic air purifier that naturally filters household toxins and signals clearly when thirsty.",
      careGuide: "Keep in moderate indirect light. Water when the top inch of soil is dry or leaves slightly soften. Wipe broad leaves regularly."
    },
    {
      id: "prod-2",
      name: "Snake Plant",
      category: "indoor-plants",
      categoryName: "Indoor Plants",
      price: 26.00,
      oldPrice: 32.00,
      discount: "18% OFF",
      rating: 4.9,
      reviewsCount: 160,
      badge: "Top Pick",
      badgeType: "bestseller",
      inStock: true,
      stockQty: 45,
      isFeatured: true,
      isSeasonal: false,
      light: "Low to Bright Light",
      water: "Every 2-3 Weeks",
      petFriendly: false,
      airPurifying: true,
      difficulty: "Indestructible",
      sku: "FC-SNA-02",
      tags: ["indoor", "snake plant", "sansevieria", "air-purifying", "low-light", "easy-care"],
      images: [
        "assets/images/Snake_Plant_2K_202608190649.jpeg",
        "assets/images/Snake_Plant_2K_202608190649 (1).jpeg",
        "assets/images/Snake_Plant_2K_202608190649 (2).jpeg"
      ],
      description: "Upright sword-like leaves with vivid golden-yellow borders. One of the toughest houseplants in existence, releasing oxygen at night and thriving even in low-light rooms.",
      careGuide: "Allow soil to dry out completely between waterings. Thrives in virtually any light setting."
    },
    {
      id: "prod-3",
      name: "Money Plant",
      category: "indoor-plants",
      categoryName: "Indoor Plants",
      price: 19.00,
      oldPrice: 24.00,
      discount: "20% OFF",
      rating: 4.9,
      reviewsCount: 185,
      badge: "Bestseller",
      badgeType: "bestseller",
      inStock: true,
      stockQty: 50,
      isFeatured: true,
      isSeasonal: false,
      light: "Medium to Bright Indirect",
      water: "Weekly",
      petFriendly: false,
      airPurifying: true,
      difficulty: "Beginner Friendly",
      sku: "FC-MON-03",
      tags: ["indoor", "money plant", "pothos", "trailing", "hanging", "good-luck", "foliage"],
      images: [
        "assets/images/Money_Plant_2K_202608190651.jpeg",
        "assets/images/Money_Plant_2K_202608190651 (1).jpeg",
        "assets/images/Money_Plant_2K_202608190651 (2).jpeg"
      ],
      description: "Heart-shaped lush foliage with bright golden variegation. Famed for bringing vibrant green energy and good fortune into homes, cascading beautifully off shelves and tables.",
      careGuide: "Water once a week when the soil surface dries out. Tolerates low-light and irregular waterings."
    },
    {
      id: "prod-4",
      name: "Monstera Deliciosa",
      category: "indoor-plants",
      categoryName: "Indoor Plants",
      price: 38.00,
      oldPrice: 48.00,
      discount: "20% OFF",
      rating: 4.9,
      reviewsCount: 210,
      badge: "Iconic Jungle",
      badgeType: "bestseller",
      inStock: true,
      stockQty: 25,
      isFeatured: true,
      isSeasonal: false,
      light: "Bright Indirect Light",
      water: "Every 1-2 Weeks",
      petFriendly: false,
      airPurifying: true,
      difficulty: "Easy",
      sku: "FC-DEL-04",
      tags: ["indoor", "monstera", "swiss cheese", "tropical", "statement", "large"],
      images: [
        "assets/images/products/monstera-1.jpg",
        "assets/images/products/monstera-2.jpg",
        "assets/images/products/monstera-3.jpg"
      ],
      description: "Dramatic perforated split leaves bringing instant tropical botanical flair to bright interiors. As Monstera matures, its broad leaves develop natural fenestrations that capture sunlight.",
      careGuide: "Place near a bright window out of harsh direct sun. Water when the top 2 inches of soil feel dry."
    },
    {
      id: "prod-5",
      name: "Areca Palm",
      category: "indoor-plants",
      categoryName: "Indoor Plants",
      price: 42.00,
      oldPrice: 52.00,
      discount: "19% OFF",
      rating: 4.8,
      reviewsCount: 78,
      badge: "Pet Friendly",
      badgeType: "organic",
      inStock: true,
      stockQty: 20,
      isFeatured: true,
      isSeasonal: false,
      light: "Bright Filtered Light",
      water: "Every 7-10 Days",
      petFriendly: true,
      airPurifying: true,
      difficulty: "Intermediate",
      sku: "FC-PALM-05",
      tags: ["indoor", "areca palm", "palm", "pet-friendly", "air-purifying", "tropical", "non-toxic"],
      images: [
        "assets/images/Areca_Palm_2K_202608190653 (2).jpeg",
        "assets/images/Areca_Palm_2K_202608190653 (1).jpeg",
        "assets/images/Areca_Palm_2K_202608190653.jpeg"
      ],
      description: "Feathery arching fronds creating a lush tropical canopy in living rooms and sunlit spaces. Serves as a natural room humidifier and is 100% non-toxic to dogs and cats.",
      careGuide: "Loves bright filtered sunshine and consistently moist, well-draining soil. Mist leaves in dry winter months."
    },
    {
      id: "prod-6",
      name: "Rose Plant",
      category: "outdoor-plants",
      categoryName: "Outdoor Plants",
      price: 32.00,
      oldPrice: 40.00,
      discount: "20% OFF",
      rating: 4.9,
      reviewsCount: 115,
      badge: "Fragrant Bloom",
      badgeType: "bestseller",
      inStock: true,
      stockQty: 35,
      isFeatured: true,
      isSeasonal: true,
      light: "Full Sun (6+ Hours)",
      water: "Regular (2-3 times/week)",
      petFriendly: true,
      airPurifying: false,
      difficulty: "Intermediate",
      sku: "FC-ROSE-06",
      tags: ["outdoor", "rose", "blooming", "fragrant", "pink", "garden", "pet-friendly"],
      images: [
        "assets/images/products/rose-plant-1.jpg",
        "assets/images/products/rose-plant-2.jpg",
        "assets/images/products/rose-plant-3.jpg"
      ],
      description: "Romantic clusters of fragrant pink double-petaled blooms for sunny garden beds and patios. Highly disease-resistant variety with glossy green foliage and continuous summer flowering.",
      careGuide: "Plant in full sun with rich organic compost. Water deeply at the root base and deadhead spent blooms."
    },
    {
      id: "prod-7",
      name: "Jasmine Plant",
      category: "outdoor-plants",
      categoryName: "Outdoor Plants",
      price: 24.00,
      oldPrice: 30.00,
      discount: "20% OFF",
      rating: 4.9,
      reviewsCount: 98,
      badge: "Heavily Scented",
      badgeType: "organic",
      inStock: true,
      stockQty: 40,
      isFeatured: false,
      isSeasonal: true,
      light: "Full Sun to Partial Shade",
      water: "Moderate (Every 2-3 Days)",
      petFriendly: true,
      airPurifying: false,
      difficulty: "Easy",
      sku: "FC-JAS-07",
      tags: ["outdoor", "jasmine", "mogra", "scented", "white flowers", "aromatic", "pet-friendly"],
      images: [
        "assets/images/Jasmine_Plant_2K_202608181819.jpeg",
        "assets/images/Jasmine_Plant_2K_202608181818 (1).jpeg",
        "assets/images/Jasmine_Plant_2K_202608181818.jpeg"
      ],
      description: "Intensely sweet star-white blossoms prized for their world-famous aroma that perfumes the evening breeze. A vigorous blooming climber or shrub perfect for balconies and sunny garden trellises.",
      careGuide: "Requires 4-6 hours of daily sunlight. Feed monthly with organic fertilizer during active flowering periods."
    },
    {
      id: "prod-8",
      name: "Hibiscus Plant",
      category: "outdoor-plants",
      categoryName: "Outdoor Plants",
      price: 26.00,
      oldPrice: null,
      discount: null,
      rating: 4.7,
      reviewsCount: 62,
      badge: "Pollinator Magnet",
      badgeType: "new",
      inStock: true,
      stockQty: 30,
      isFeatured: false,
      isSeasonal: true,
      light: "Full Direct Sunlight",
      water: "Daily in Warm Seasons",
      petFriendly: true,
      airPurifying: false,
      difficulty: "Easy",
      sku: "FC-HIB-08",
      tags: ["outdoor", "hibiscus", "red flower", "tropical", "pollinator", "sun-loving", "pet-friendly"],
      images: [
        "assets/images/Hibiscus_Plant_2K_202608181815.jpeg",
        "assets/images/Hibiscus_Plant_2K_202608181814 (1).jpeg",
        "assets/images/Hibiscus_Plant_2K_202608181814.jpeg"
      ],
      description: "Stunning large 6-inch scarlet red trumpet flowers that attract butterflies and hummingbirds. Prolific summer blooming shrub for sunny patios and landscaped borders.",
      careGuide: "Keep in maximum sunlight. Water daily during hot summer weeks and protect from winter frost."
    },
    {
      id: "prod-9",
      name: "Ceramic Plant Pot",
      category: "flower-pots",
      categoryName: "Flower Pots",
      price: 29.00,
      oldPrice: 36.00,
      discount: "19% OFF",
      rating: 4.9,
      reviewsCount: 84,
      badge: "Scandinavian",
      badgeType: "bestseller",
      inStock: true,
      stockQty: 40,
      isFeatured: true,
      isSeasonal: false,
      material: "High-Fired Glazed Stoneware Ceramic",
      size: "8-Inch Diameter",
      sku: "FC-POT-09",
      tags: ["flower-pots", "pot", "ceramic", "nordic", "glazed", "planter", "green"],
      images: [
        "assets/images/Ceramic_Plant_Pot_2K_202608190655 (2).jpeg",
        "assets/images/Ceramic_Plant_Pot_2K_202608190655 (1).jpeg",
        "assets/images/Ceramic_Plant_Pot_2K_202608190655.jpeg"
      ],
      description: "Minimalist sage-green ceramic pot with smooth matte finish, drainage hole, and matching saucer. Crafted from heavy stoneware to provide balanced insulation for plant roots.",
      careGuide: "Wipe with damp microfiber cloth. Includes removable silicone drainage stopper for flexible indoor use."
    },
    {
      id: "prod-10",
      name: "Terracotta Garden Pot",
      category: "flower-pots",
      categoryName: "Flower Pots",
      price: 22.50,
      oldPrice: 28.00,
      discount: "20% OFF",
      rating: 4.8,
      reviewsCount: 112,
      badge: "100% Breathable",
      badgeType: "organic",
      inStock: true,
      stockQty: 60,
      isFeatured: false,
      isSeasonal: false,
      material: "Natural Tuscan Porous Clay",
      size: "9-Inch Diameter",
      sku: "FC-POT-10",
      tags: ["flower-pots", "pot", "terracotta", "clay", "drainage", "saucer", "handmade"],
      images: [
        "assets/images/Terracotta_Garden_Pot_2K_202608181811 (2).jpeg",
        "assets/images/Terracotta_Garden_Pot_2K_202608181811.jpeg",
        "assets/images/Terracotta_Garden_Pot_2K_202608181811 (1).jpeg"
      ],
      description: "Traditional Italian porous clay pot promoting natural root aeration and preventing overwatering. Includes a matching drainage saucer to catch excess moisture.",
      careGuide: "Rinse with clean water before potting. Suitable for indoor houseplants and patio gardens."
    },
    {
      id: "prod-11",
      name: "Hanging Plant Pot",
      category: "flower-pots",
      categoryName: "Flower Pots",
      price: 25.00,
      oldPrice: 32.00,
      discount: "22% OFF",
      rating: 4.9,
      reviewsCount: 96,
      badge: "Space Saver",
      badgeType: "bestseller",
      inStock: true,
      stockQty: 35,
      isFeatured: false,
      isSeasonal: false,
      material: "Glazed Ceramic Bowl & 100% Organic Cotton Cord",
      size: "7-Inch Pot / 36-Inch Drop",
      sku: "FC-POT-11",
      tags: ["flower-pots", "pot", "hanging", "macrame", "boho", "vertical garden", "cotton"],
      images: [
        "assets/images/Hanging_Plant_Pot_2K_202608181807.jpeg",
        "assets/images/Hanging_Plant_Pot_2K_202608181806.jpeg",
        "assets/images/Hanging_Plant_Pot_2K_202608181806 (1).jpeg"
      ],
      description: "Hand-knotted organic cotton macrame hanger paired with a minimalist cream ceramic bowl. Perfect for trailing vines and optimizing window vertical space.",
      careGuide: "Includes stainless steel ceiling hook and wall anchor. Safe for indoor and porch hanging."
    },
    {
      id: "prod-12",
      name: "Rose Flower Seeds",
      category: "seeds",
      categoryName: "Seeds",
      price: 12.00,
      oldPrice: 15.00,
      discount: "20% OFF",
      rating: 4.7,
      reviewsCount: 54,
      badge: "Non-GMO",
      badgeType: "organic",
      inStock: true,
      stockQty: 80,
      isFeatured: false,
      isSeasonal: true,
      germinationRate: "88% Tested",
      sku: "FC-SEED-12",
      tags: ["seeds", "rose seeds", "flowers", "heirloom", "non-gmo", "gardening", "climbing"],
      images: [
        "assets/images/Rose_Flower_Seeds_2K_202608181800.jpeg",
        "assets/images/Rose_Flower_Seeds_2K_202608181800 (1).jpeg",
        "assets/images/Rose_Flower_Seeds_2K_202608181801 (1).jpeg"
      ],
      description: "Premium non-GMO heirloom climbing rose seeds producing multi-colored fragrant blossoms. High germination seed lot ideal for cottage fences, trellises, and sunny borders.",
      careGuide: "Cold stratify seeds in damp paper towel for 4-6 weeks before sowing in warm seed starting mix."
    },
    {
      id: "prod-13",
      name: "Sunflower Seeds",
      category: "seeds",
      categoryName: "Seeds",
      price: 9.50,
      oldPrice: null,
      discount: null,
      rating: 4.9,
      reviewsCount: 120,
      badge: "Fast Growing",
      badgeType: "organic",
      inStock: true,
      stockQty: 100,
      isFeatured: false,
      isSeasonal: true,
      germinationRate: "95% Certified",
      sku: "FC-SEED-13",
      tags: ["seeds", "sunflower", "giant", "mammoth", "summer", "pollinator", "yellow", "easy"],
      images: [
        "assets/images/Sunflower_Seeds_2K_202608181754.jpeg",
        "assets/images/Sunflower_Seeds_2K_202608181754 (1).jpeg",
        "assets/images/Sunflower_Seeds_2K_202608181754 (2).jpeg"
      ],
      description: "Fast-growing giant sunflower seeds producing towering 12-foot golden flowers with heads packed with edible seeds for birds and healthy snacking.",
      careGuide: "Direct sow 1 inch deep in warm garden soil under full sunshine. Keep moist until sprouts appear."
    },
    {
      id: "prod-14",
      name: "Organic Potting Soil",
      category: "soil-fertilizers",
      categoryName: "Soil & Fertilizers",
      price: 18.00,
      oldPrice: 22.00,
      discount: "18% OFF",
      rating: 4.8,
      reviewsCount: 140,
      badge: "100% Organic",
      badgeType: "organic",
      inStock: true,
      stockQty: 55,
      isFeatured: true,
      isSeasonal: false,
      composition: "Coco Coir, Perlite, Worm Castings, Mycorrhizae & Biochar",
      sku: "FC-SOIL-14",
      tags: ["soil-fertilizers", "soil", "potting mix", "organic", "perlite", "coco coir", "worm castings"],
      images: [
        "assets/images/products/potting-soil-1.jpg",
        "assets/images/products/potting-soil-2.jpg",
        "assets/images/products/potting-soil-3.jpg"
      ],
      description: "Premium aerated potting blend enriched with live mycorrhizal fungi and organic worm castings. Prevents root rot and supplies organic nutrients for up to 6 months.",
      careGuide: "Ready to use straight from the bag for indoor houseplants, patio containers, and balcony herbs."
    },
    {
      id: "prod-15",
      name: "Organic Plant Fertilizer",
      category: "soil-fertilizers",
      categoryName: "Soil & Fertilizers",
      price: 16.50,
      oldPrice: 20.00,
      discount: "18% OFF",
      rating: 4.9,
      reviewsCount: 88,
      badge: "Fast Absorbing",
      badgeType: "bestseller",
      inStock: true,
      stockQty: 65,
      isFeatured: false,
      isSeasonal: false,
      composition: "Cold-Water Sea Kelp, Humic Acids & NPK (4-2-3)",
      sku: "FC-FERT-15",
      tags: ["soil-fertilizers", "fertilizer", "liquid", "organic", "seaweed", "plant food", "growth"],
      images: [
        "assets/images/Organic_Plant_Fertilizer_2K_202608181748.jpeg",
        "assets/images/Organic_Plant_Fertilizer_2K_202608181747 (1).jpeg",
        "assets/images/Organic_Plant_Fertilizer_2K_202608181747.jpeg"
      ],
      description: "Concentrated cold-extracted seaweed and trace mineral elixir for vibrant foliage and abundant blooms. Stimulates deep root growth and plant vitality naturally.",
      careGuide: "Dilute 5ml (1 capful) in 1 liter of water. Feed houseplants and garden plants every 14 days."
    },
    {
      id: "prod-16",
      name: "Neem Cake Fertilizer",
      category: "soil-fertilizers",
      categoryName: "Soil & Fertilizers",
      price: 14.00,
      oldPrice: 18.00,
      discount: "22% OFF",
      rating: 4.8,
      reviewsCount: 72,
      badge: "Pest Defense",
      badgeType: "organic",
      inStock: true,
      stockQty: 45,
      isFeatured: false,
      isSeasonal: false,
      composition: "100% Organic Neem Seed Meal",
      sku: "FC-NEEM-16",
      tags: ["soil-fertilizers", "neem cake", "organic", "fertilizer", "pest defense", "nematodes", "soil conditioner"],
      images: [
        "assets/images/Neem_Cake_Fertilizer_2K_202608190709 (1).jpeg",
        "assets/images/Neem_Cake_Fertilizer_2K_202608190709.jpeg",
        "assets/images/Neem_Cake_Fertilizer_2K_202608190708.jpeg"
      ],
      description: "Dual-action organic soil conditioner made from cold-pressed neem seeds. Releases slow organic nutrients while shielding roots from destructive soil nematodes and pests.",
      careGuide: "Mix 2-3 tablespoons into topsoil layer once every 30 days and water thoroughly."
    },
    {
      id: "prod-17",
      name: "Gardening Hand Trowel",
      category: "gardening-tools",
      categoryName: "Gardening Tools",
      price: 17.50,
      oldPrice: null,
      discount: null,
      rating: 4.9,
      reviewsCount: 92,
      badge: "Lifetime Warranty",
      badgeType: "organic",
      inStock: true,
      stockQty: 50,
      isFeatured: false,
      isSeasonal: false,
      material: "Mirror-Polished Rust-Proof Stainless Steel & Ash Wood",
      sku: "FC-TOOL-17",
      tags: ["gardening-tools", "tools", "trowel", "hand shovel", "stainless steel", "hardwood", "durable"],
      images: [
        "assets/images/Gardening_Hand_Trowel_2K_202608181741.jpeg",
        "assets/images/Gardening_Hand_Trowel_2K_202608181740 (1).jpeg",
        "assets/images/Gardening_Hand_Trowel_2K_202608181740.jpeg"
      ],
      description: "Deep-dished stainless steel blade with laser-etched depth markings and contoured grip. Rust-proof construction makes planting bulbs and scooping soil effortless.",
      careGuide: "Wipe soil clean with a dry cloth and hang by the genuine leather storage loop."
    },
    {
      id: "prod-18",
      name: "Pruning Shears",
      category: "gardening-tools",
      categoryName: "Gardening Tools",
      price: 27.00,
      oldPrice: 34.00,
      discount: "21% OFF",
      rating: 4.9,
      reviewsCount: 135,
      badge: "Pro Grade",
      badgeType: "bestseller",
      inStock: true,
      stockQty: 40,
      isFeatured: true,
      isSeasonal: false,
      material: "SK-5 Japanese High Carbon Carbon Steel",
      sku: "FC-TOOL-18",
      tags: ["gardening-tools", "tools", "pruning shears", "secateurs", "cutter", "japanese steel", "sharp"],
      images: [
        "assets/images/Pruning_Shears_2K_202608181826 (2).jpeg",
        "assets/images/Pruning_Shears_2K_202608181826 (1).jpeg",
        "assets/images/Pruning_Shears_2K_202608181826.jpeg"
      ],
      description: "Razor-sharp Japanese SK-5 high carbon steel bypass blades producing surgical stem cuts that heal quickly. Cushioned ergonomic handles reduce hand fatigue.",
      careGuide: "Wipe blades after pruning sap-rich plants and lubricate hinge pivot with mineral oil."
    },
    {
      id: "prod-19",
      name: "Garden Watering Can",
      category: "gardening-tools",
      categoryName: "Gardening Tools",
      price: 34.00,
      oldPrice: 42.00,
      discount: "19% OFF",
      rating: 4.8,
      reviewsCount: 82,
      badge: "Rustic Classic",
      badgeType: "bestseller",
      inStock: true,
      stockQty: 30,
      isFeatured: false,
      isSeasonal: false,
      material: "Rust-Proof Galvanized Zinc Steel with Brass Rosette",
      capacity: "2.0 Gallons (7.5 Liters)",
      sku: "FC-CAN-19",
      tags: ["gardening-tools", "tools", "watering can", "galvanized", "brass rose", "patio", "sprinkler"],
      images: [
        "assets/images/products/watering-can-1.jpg",
        "assets/images/products/watering-can-2.jpg",
        "assets/images/products/watering-can-3.jpg"
      ],
      description: "Timeless galvanized watering can with removable fine-spray brass rosette. Dual ergonomic handles allow comfortable pouring for delicate seedlings and outdoor flowerbeds.",
      careGuide: "Drain completely before storing indoors during winter freeze cycles."
    },
    {
      id: "prod-20",
      name: "Plant Support Stand",
      category: "plant-accessories",
      categoryName: "Plant Accessories",
      price: 29.50,
      oldPrice: 38.00,
      discount: "22% OFF",
      rating: 4.9,
      reviewsCount: 108,
      badge: "Adjustable",
      badgeType: "new",
      inStock: true,
      stockQty: 45,
      isFeatured: true,
      isSeasonal: false,
      material: "100% Sustainable Natural Bamboo",
      size: "Adjustable width 8 to 12 inches",
      sku: "FC-ACC-20",
      tags: ["plant-accessories", "accessories", "plant stand", "bamboo", "mid-century", "wooden stand", "adjustable"],
      images: [
        "assets/images/Plant_Support_Stand_2K_202608181822 (2).jpeg",
        "assets/images/Plant_Support_Stand_2K_202608181822 (1).jpeg",
        "assets/images/Plant_Support_Stand_2K_202608181822.jpeg"
      ],
      description: "Expandable mid-century modern bamboo plant stand fitting pots from 8 to 12 inches. Reversible design offers two distinct display heights for indoor botanical styling.",
      careGuide: "Simple 1-screw tool-free assembly. Wipe with damp cloth to maintain natural bamboo luster."
    }
  ],

  categories: [
    {
      id: "soil-fertilizers",
      name: "Soil & Fertilizers",
      slug: "soil-fertilizers",
      count: 3,
      image: "assets/images/blog/soil-aeration.jpg",
      description: "Organic bio-active potting mixes, liquid kelp, and neem cake."
    },
    {
      id: "gardening-tools",
      name: "Gardening Tools",
      slug: "gardening-tools",
      count: 3,
      image: "assets/images/blog/gardening-tools.jpg",
      description: "Ergonomic stainless trowels, Japanese steel shears, and watering cans."
    },
    {
      id: "plant-accessories",
      name: "Plant Accessories",
      slug: "plant-accessories",
      count: 1,
      image: "assets/images/blog/plant-accessories.jpg",
      description: "Hanging macrame planters, brass moisture meters, and plant stands."
    }
  ],

  blogs: [
    {
      id: "blog-1",
      slug: "complete-guide-to-monstera-care",
      title: "The Ultimate Monstera Deliciosa Care & Propagation Guide",
      category: "Indoor Plant Care",
      readTime: "6 min read",
      date: "Aug 12, 2026",
      author: {
        name: "Elena Rostova",
        role: "Chief Botanist",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
      },
      image: "assets/images/blog/monstera-guide.jpg",
      excerpt: "Learn how to encourage massive fenestrations, conquer aerial root staking with moss poles, and prune without fear.",
      content: `
        <p>Monstera Deliciosa is revered for its dramatic split leaves and fast-growing tropical nature. Originating in the rainforest canopies of Southern Mexico and Central America, this epiphytic vine thrives when given dappled light and vertical climbing support.</p>
        
        <h3>1. Lighting & Ideal Placement</h3>
        <p>In their natural rainforest habitat, Monsteras climb massive tree trunks beneath dense canopies. They love <strong>bright, indirect sunlight</strong>. If placed in harsh, direct midday sunlight, their tender foliage will scorch with yellow-brown sun spots. If kept in too dim lighting, the new leaves will remain small without developing their iconic cutouts (fenestrations).</p>
        
        <h3>2. Mastering the Watering Routine</h3>
        <p>Overwatering is the #1 enemy of Monsteras. Always follow the <em>soak and dry</em> principle:</p>
        <ul>
          <li>Insert your finger 2 inches into the soil. If damp, wait 3-4 days.</li>
          <li>When dry, water deeply until water drains freely from the pot base.</li>
          <li>Never let the pot sit in standing drainage saucer water.</li>
        </ul>

        <h3>3. Staking with Coir or Moss Poles</h3>
        <p>As Monsteras mature, they produce thick brown aerial roots. Staking them to a moist sphagnum moss pole signals the plant that it is climbing a tree, triggering larger foliage development up to 3 feet in width!</p>
      `,
      checklist: [
        "Position 3-5 feet from south/east-facing window",
        "Water only when top 2-3 inches are dry",
        "Mist foliage twice weekly or run a humidifier",
        "Wipe broad leaves with neem oil quarterly"
      ]
    },
    {
      id: "blog-2",
      slug: "soil-aeration-and-perlite-secrets",
      title: "Why Your Houseplants Are Dying: The Root Suffocation Myth",
      category: "Soil & Nutrients",
      readTime: "4 min read",
      date: "Aug 05, 2026",
      author: {
        name: "Marcus Vance",
        role: "Horticulture Specialist",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
      },
      image: "assets/images/blog/soil-aeration.jpg",
      excerpt: "Discover how chunky soil blends containing perlite, orchid bark, and pumice prevent root rot and double root growth.",
      content: `
        <p>Standard dense potting soil retains far too much water around root hairs, depriving them of oxygen. By blending 40% organic matter with 30% chunky pine bark and 30% coarse perlite or pumice, you create macropores where oxygen and moisture maintain harmonious balance.</p>
        <h3>The Golden Aroid Soil Recipe</h3>
        <ul>
          <li>1 part Organic peat or coco coir</li>
          <li>1 part Horticultural coarse perlite</li>
          <li>1 part Chunky fir orchid bark</li>
          <li>1/2 part Pure worm castings (for natural microbiology)</li>
        </ul>
      `,
      checklist: [
        "Never use heavy outdoor garden clay in indoor pots",
        "Always ensure your planter has at least one drainage hole",
        "Incorporate 25-30% aeration substrate per volume"
      ]
    },
    {
      id: "blog-3",
      slug: "terracotta-vs-ceramic-planters",
      title: "Terracotta vs. Glazed Ceramic: Choosing the Perfect Pot",
      category: "Pots & Planters",
      readTime: "5 min read",
      date: "Jul 28, 2026",
      author: {
        name: "Sophia Chen",
        role: "Landscape Architect",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
      },
      image: "assets/images/blog/terracotta-vs-ceramic.jpg",
      excerpt: "Different plants have wildly different moisture needs. Here is how pot porosity affects root biology and watering cycles.",
      content: `
        <p>Terracotta is porous clay that naturally 'wicks' excess water out through the walls of the pot. It is ideal for cacti, succulents, snake plants, and monsteras. Glazed ceramic or stoneware, conversely, locks moisture inside, making it superior for thirsty ferns, calatheas, and peace lilies.</p>
      `,
      checklist: [
        "Choose Terracotta for succulents, hoyas, and arid varieties",
        "Choose Glazed Ceramic for moisture-loving ferns & calatheas",
        "Always size up no more than 2 inches during seasonal repotting"
      ]
    },
    {
      id: "blog-4",
      slug: "organic-pest-control-recipes",
      title: "Non-Toxic Neem Oil & Castile Soap Spray for Thrips & Fungus Gnats",
      category: "Pest Management",
      readTime: "7 min read",
      date: "Jul 19, 2026",
      author: {
        name: "Elena Rostova",
        role: "Chief Botanist",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
      },
      image: "assets/images/blog/neem-spray.jpg",
      excerpt: "Combat common pests without inhaling toxic synthetic chemicals with our laboratory-tested cold-pressed neem emulsion.",
      content: `
        <p>Fungus gnats and spider mites thrive in stagnant, overwatered soil. Our natural foliar spray suffocates soft-bodied pests without harming delicate chlorophyll structures.</p>
        <h3>The Recipe</h3>
        <p>Mix 1 teaspoon 100% cold-pressed raw neem oil with 1/2 teaspoon pure liquid castile soap in 1 liter of lukewarm distilled water. Shake vigorously and spray under leaf surfaces at dusk.</p>
      `,
      checklist: [
        "Never apply foliar sprays under intense direct sunlight",
        "Treat infected plants in isolation for 14 days",
        "Use yellow sticky traps to catch adult fungus gnats"
      ]
    }
  ],

  testimonials: [
    {
      name: "Claire Davenport",
      role: "Interior Designer, Studio Verde",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      comment: "FloraCraft supplies all the botanical installations for our penthouse staging projects. The quality of both the hand-thrown terracotta pots and the lush specimens is simply unparalleled in the industry."
    },
    {
      name: "David Sterling",
      role: "Urban Gardener & Plant Collector",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      comment: "The shipping packaging was remarkable! My Monstera arrived pristine without a single leaf bruised, and the bioactive soil has triggered 4 new fenestrated leaves in just three weeks."
    },
    {
      name: "Amara Okonjo",
      role: "Architectural Landscaper",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      comment: "Their wholesale B2B pricing calculator made ordering 150 planters and lavender shrubs for our boutique hotel project seamless. Delivered right on schedule with custom soil mixes."
    }
  ],

  team: [
    {
      name: "Dr. Alistair Finch",
      role: "Founder & Master Horticulturist",
      bio: "Over 22 years of botanical research, nursery cultivation, and sustainable soil regeneration.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Elena Rostova",
      role: "Chief Botanist & Plant Doctor",
      bio: "Specializes in rare tropical aroids, pest pathology, and indoor biome optimization.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Marcus Vance",
      role: "Head of Nursery Operations",
      bio: "Oversees our 12-acre solar greenhouse cultivating over 80,000 organic seedlings annually.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Sophia Chen",
      role: "Lead Landscape & Ceramic Designer",
      bio: "Creates timeless handcrafted pottery lines and bespoke urban rooftop garden blueprints.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
    }
  ],

  faqs: [
    {
      q: "How are live plants safely packaged for shipping?",
      a: "Every plant is secured in custom eco-friendly biodegradable corrugated cradles with specialized moisture-locking root wraps and thermal insulated padding for seasonal temperature stability."
    },
    {
      q: "What is your 30-Day Plant Health Guarantee?",
      a: "If your plant arrives damaged or declines within 30 days of arrival despite following care guidelines, send us a photo and our Plant Doctor will diagnose it or ship a free replacement immediately."
    },
    {
      q: "Do your pots come with drainage holes?",
      a: "Yes! All our terracotta and ceramic planters include bottom drainage holes and optional removable silicone plugs or matching drip trays."
    },
    {
      q: "How does the B2B Wholesale discount tier work?",
      a: "Orders above 10 units receive 10% off, orders above 50 units receive 20% off, and volume orders exceeding 200 units receive 35% discount plus freight consolidation."
    },
    {
      q: "Can I book a personalized Plant Doctor consultation?",
      a: "Yes, you can schedule a 30-minute virtual consultation with one of our certified botanists through our Home 2 Landscaping & Clinic portal."
    }
  ],

  coupons: {
    "GROW20": { discountPercent: 20, description: "20% Off Spring Gardening Sale" },
    "SPRING10": { discountPercent: 10, description: "10% Off Welcome Discount" },
    "FREESHIP": { discountPercent: 0, freeShipping: true, description: "Free Standard Shipping" }
  }
};

// Global Helper to get product by either 'prod-1' or numerical '1' or exact id
window.getProductById = function (id) {
  if (!id) return null;
  const strId = String(id).trim();
  return FLORACRAFT_DATA.products.find(
    (p) => p.id === strId || p.id === `prod-${strId}` || p.id.replace("prod-", "") === strId
  ) || null;
};

// Attach globally
window.FLORACRAFT_DATA = FLORACRAFT_DATA;

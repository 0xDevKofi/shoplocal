// products.js - Mock Product Data

// Product database
const products = [
    {
        id: 1,
        name: "Handwoven Basket",
        category: "home-decor",
        categoryName: "Home Decor",
        price: 45.00,
        description: "Beautiful handwoven basket crafted by local artisans using traditional techniques. Perfect for storage or as a decorative piece in any room. Each basket is unique and may vary slightly in color and pattern.",
        images: [
            "./images/baskets.jfif"
        ],
        inStock: true,
        featured: true,
        details: {
            material: "Natural woven fiber",
            dimensions: "12\" x 10\" x 8\"",
            weight: "0.8 kg",
            care: "Wipe clean with damp cloth",
            origin: "Handmade in Ghana"
        }
    },
    {
        id: 2,
        name: "Kente Cloth Scarf",
        category: "textiles",
        categoryName: "Textiles",
        price: 65.00,
        description: "Authentic Kente cloth scarf with vibrant traditional patterns. Hand-woven using premium quality threads. A piece of Ghanaian heritage you can wear.",
        images: [
           "./images/kentecloth.jfif"
        ],
        inStock: true,
        featured: true,
        details: {
            material: "100% Cotton",
            dimensions: "72\" x 12\"",
            weight: "0.3 kg",
            care: "Hand wash cold, air dry",
            origin: "Handmade in Ghana"
        }
    },
    {
        id: 3,
        name: "Beaded Necklace",
        category: "jewelry",
        categoryName: "Jewelry",
        price: 35.00,
        description: "Elegant beaded necklace featuring traditional African patterns and colors. Each bead is carefully selected and strung by hand.",
        images: [
           "./images/beadednecklace.jfif"
        ],
        inStock: true,
        featured: false,
        details: {
            material: "Glass beads, cotton cord",
            dimensions: "18\" length",
            weight: "0.1 kg",
            care: "Wipe with soft cloth",
            origin: "Handmade in Ghana"
        }
    },
    {
        id: 4,
        name: "Clay Pottery Vase",
        category: "pottery",
        categoryName: "Pottery",
        price: 55.00,
        description: "Hand-thrown clay vase with traditional African motifs. Perfect for fresh or dried flowers, or as a standalone decorative piece.",
        images: [
            "./images/claypot.jfif"
        ],
        inStock: true,
        featured: true,
        details: {
            material: "Terracotta clay",
            dimensions: "10\" height, 6\" diameter",
            weight: "1.2 kg",
            care: "Wipe clean, not dishwasher safe",
            origin: "Handmade in Ghana"
        }
    },
    {
        id: 5,
        name: "Woven Wall Hanging",
        category: "home-decor",
        categoryName: "Home Decor",
        price: 75.00,
        description: "Stunning woven wall hanging featuring geometric patterns. Adds warmth and texture to any room.",
        images: [
           "./images/wallhanging.jfif"
        ],
        inStock: true,
        featured: false,
        details: {
            material: "Cotton and wool blend",
            dimensions: "24\" x 36\"",
            weight: "0.6 kg",
            care: "Spot clean only",
            origin: "Handmade in Ghana"
        }
    },
    {
        id: 6,
        name: "Adinkra Print Cushion",
        category: "textiles",
        categoryName: "Textiles",
        price: 28.00,
        description: "Decorative cushion featuring authentic Adinkra symbols. Includes removable cover and insert.",
        images: [
           "./images/printcushion.jfif"
        ],
        inStock: true,
        featured: true,
        details: {
            material: "100% Cotton cover, polyester fill",
            dimensions: "18\" x 18\"",
            weight: "0.4 kg",
            care: "Machine wash cover cold",
            origin: "Handmade in Ghana"
        }
    },
    {
        id: 7,
        name: "Brass Bracelet Set",
        category: "jewelry",
        categoryName: "Jewelry",
        price: 42.00,
        description: "Set of three handcrafted brass bracelets with intricate patterns. Can be worn together or separately.",
        images: [
           "./images/brassbracelet.jfif"
        ],
        inStock: false,
        featured: false,
        details: {
            material: "Brass",
            dimensions: "2.5\" diameter (adjustable)",
            weight: "0.15 kg",
            care: "Polish with soft cloth",
            origin: "Handmade in Ghana"
        }
    },
    {
        id: 8,
        name: "Ceramic Bowl Set",
        category: "pottery",
        categoryName: "Pottery",
        price: 68.00,
        description: "Set of four handmade ceramic bowls in varying sizes. Perfect for serving or as decorative pieces.",
        images: [
            "./images/bowlset.jfif"
        ],
        inStock: true,
        featured: false,
        details: {
            material: "Glazed ceramic",
            dimensions: "Various sizes: 4\" to 8\" diameter",
            weight: "1.8 kg",
            care: "Dishwasher safe",
            origin: "Handmade in Ghana"
        }
    },
    {
        id: 9,
        name: "Wooden Sculpture",
        category: "art",
        categoryName: "Art & Prints",
        price: 95.00,
        description: "Hand-carved wooden sculpture depicting traditional African art. Each piece is unique.",
        images: [
            "./images/woodensculpture.jfif"
        ],
        inStock: true,
        featured: true,
        details: {
            material: "Mahogany wood",
            dimensions: "14\" height",
            weight: "1.5 kg",
            care: "Dust with soft cloth",
            origin: "Handmade in Ghana"
        }
    },
    {
        id: 10,
        name: "Batik Table Runner",
        category: "textiles",
        categoryName: "Textiles",
        price: 38.00,
        description: "Hand-dyed batik table runner with traditional patterns. Adds color and culture to your dining table.",
        images: [
           "./images/tablecloth.jfif"
        ],
        inStock: true,
        featured: false,
        details: {
            material: "100% Cotton",
            dimensions: "72\" x 14\"",
            weight: "0.3 kg",
            care: "Hand wash cold",
            origin: "Handmade in Ghana"
        }
    },
    {
        id: 11,
        name: "Leather Wallet",
        category: "accessories",
        categoryName: "Accessories",
        price: 32.00,
        description: "Handcrafted leather wallet with traditional embossed patterns. Multiple card slots and bill compartments.",
        images: [
            "./images/wallet.jfif"
        ],
        inStock: true,
        featured: false,
        details: {
            material: "Genuine leather",
            dimensions: "4.5\" x 3.5\"",
            weight: "0.1 kg",
            care: "Condition leather periodically",
            origin: "Handmade in Ghana"
        }
    },
    {
        id: 12,
        name: "Woven Storage Basket Set",
        category: "home-decor",
        categoryName: "Home Decor",
        price: 85.00,
        description: "Set of three nesting baskets in different sizes. Perfect for organizing and storage with style.",
        images: [
            "./images/storagebasket.jfif"
        ],
        inStock: true,
        featured: true,
        details: {
            material: "Seagrass and raffia",
            dimensions: "Small: 8\", Medium: 10\", Large: 12\"",
            weight: "1.2 kg",
            care: "Wipe clean",
            origin: "Handmade in Ghana"
        }
    }
];

// Get product by ID
function getProductById(id) {
    return products.find(product => product.id === parseInt(id));
}

// Get featured products
function getFeaturedProducts(limit = 6) {
    return products.filter(product => product.featured).slice(0, limit);
}

// Get products by category
function getProductsByCategory(category) {
    if (category === 'all' || !category) {
        return products;
    }
    return products.filter(product => product.category === category);
}

// Filter and sort products
function filterAndSortProducts(filters = {}) {
    let filteredProducts = [...products];
    
    // Filter by category
    if (filters.categories && filters.categories.length > 0 && !filters.categories.includes('all')) {
        filteredProducts = filteredProducts.filter(product => 
            filters.categories.includes(product.category)
        );
    }
    
    // Filter by price range
    if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        filteredProducts = filteredProducts.filter(product => 
            product.price >= min && (max === null || product.price <= max)
        );
    }
    
    // Filter by availability
    if (filters.inStockOnly) {
        filteredProducts = filteredProducts.filter(product => product.inStock);
    }
    
    // Search by name
    if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.categoryName.toLowerCase().includes(query)
        );
    }
    
    // Sort products
    if (filters.sortBy) {
        switch (filters.sortBy) {
            case 'name-asc':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'price-asc':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                filteredProducts.sort((a, b) => b.id - a.id);
                break;
            default:
                // Featured first, then by ID
                filteredProducts.sort((a, b) => {
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    return a.id - b.id;
                });
        }
    }
    
    return filteredProducts;
}

// Get related products (same category, different product)
function getRelatedProducts(productId, limit = 4) {
    const product = getProductById(productId);
    if (!product) return [];
    
    return products
        .filter(p => p.category === product.category && p.id !== productId && p.inStock)
        .slice(0, limit);
}

// Format price
function formatPrice(price) {
    return `GH₵ ${price.toFixed(2)}`;
}
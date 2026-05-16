// cart.js - Shopping Cart Management

// Cart state
let cart = [];

// Initialize cart from localStorage
function initCart() {
    const savedCart = localStorage.getItem('shoplocal_cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            console.error('Error loading cart:', e);
            cart = [];
        }
    }
    updateCartCount();
    return cart;
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('shoplocal_cart', JSON.stringify(cart));
    updateCartCount();
}

// Add item to cart
function addToCart(productId, quantity = 1) {
    const product = getProductById(productId);
    if (!product) {
        console.error('Product not found:', productId);
        return false;
    }
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // Update quantity
        existingItem.quantity += quantity;
        if (existingItem.quantity > 10) {
            existingItem.quantity = 10; // Max quantity
        }
    } else {
        // Add new item
        cart.push({
            id: productId,
            quantity: Math.min(quantity, 10),
            addedAt: new Date().toISOString()
        });
    }
    
    saveCart();
    return true;
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
}

// Update item quantity
function updateCartItemQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = Math.min(Math.max(1, quantity), 10);
            saveCart();
        }
    }
}

// Get cart items with product details
function getCartItems() {
    return cart.map(item => {
        const product = getProductById(item.id);
        return {
            ...item,
            product: product
        };
    }).filter(item => item.product); // Remove items where product not found
}

// Get cart count
function getCartCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Update cart count badge in header
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cartCount, .cart-count');
    const count = getCartCount();
    
    cartCountElements.forEach(element => {
        element.textContent = count;
        if (count > 0) {
            element.style.display = 'flex';
        } else {
            element.style.display = 'none';
        }
    });
}

// Calculate cart subtotal
function getCartSubtotal() {
    return cart.reduce((total, item) => {
        const product = getProductById(item.id);
        return total + (product ? product.price * item.quantity : 0);
    }, 0);
}

// Calculate shipping cost
function getShippingCost(subtotal) {
    if (subtotal >= 100) {
        return 0; // Free shipping over GH₵ 100
    }
    return 10; // Standard shipping
}

// Calculate tax (12.5%)
function getTax(subtotal) {
    return subtotal * 0.125;
}

// Calculate cart total
function getCartTotal() {
    const subtotal = getCartSubtotal();
    const shipping = getShippingCost(subtotal);
    const tax = getTax(subtotal);
    
    return {
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: subtotal + shipping + tax
    };
}

// Clear entire cart
function clearCart() {
    cart = [];
    saveCart();
}

// Validate cart (check stock availability)
function validateCart() {
    let isValid = true;
    const issues = [];
    
    cart.forEach(item => {
        const product = getProductById(item.id);
        
        if (!product) {
            issues.push({
                id: item.id,
                issue: 'Product no longer available'
            });
            isValid = false;
        } else if (!product.inStock) {
            issues.push({
                id: item.id,
                name: product.name,
                issue: 'Out of stock'
            });
            isValid = false;
        }
    });
    
    return {
        isValid: isValid,
        issues: issues
    };
}

// Apply promo code (mock implementation)
function applyPromoCode(code) {
    const promoCodes = {
        'WELCOME10': { type: 'percentage', value: 10, description: '10% off your order' },
        'FREESHIP': { type: 'free-shipping', value: 0, description: 'Free shipping' },
        'SAVE20': { type: 'percentage', value: 20, description: '20% off your order' }
    };
    
    const upperCode = code.toUpperCase().trim();
    
    if (promoCodes[upperCode]) {
        return {
            success: true,
            promo: promoCodes[upperCode],
            code: upperCode
        };
    }
    
    return {
        success: false,
        message: 'Invalid promo code'
    };
}

// Calculate discount from promo
function calculateDiscount(promoCode, subtotal, shipping) {
    if (!promoCode) return 0;
    
    const promo = applyPromoCode(promoCode);
    if (!promo.success) return 0;
    
    switch (promo.promo.type) {
        case 'percentage':
            return subtotal * (promo.promo.value / 100);
        case 'fixed':
            return promo.promo.value;
        case 'free-shipping':
            return shipping;
        default:
            return 0;
    }
}

// Get shipping progress (for free shipping banner)
function getShippingProgress() {
    const subtotal = getCartSubtotal();
    const threshold = 100;
    const progress = Math.min((subtotal / threshold) * 100, 100);
    const remaining = Math.max(threshold - subtotal, 0);
    
    return {
        progress: progress,
        remaining: remaining,
        qualified: subtotal >= threshold
    };
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    initCart();
});
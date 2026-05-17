// main.js - Main JavaScript functionality

// ==========================================================================
// GENERAL UTILITIES
// ==========================================================================

// Show element
function show(element) {
    if (element) {
        element.hidden = false;
        element.style.display = '';
    }
}

// Hide element
function hide(element) {
    if (element) {
        element.hidden = true;
    }
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==========================================================================
// MOBILE MENU TOGGLE
// ==========================================================================

function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            this.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !mainNav.contains(e.target)) {
                menuToggle.setAttribute('aria-expanded', 'false');
                mainNav.classList.remove('active');
            }
        });
    }
}

// ==========================================================================
// HOMEPAGE - FEATURED PRODUCTS
// ==========================================================================

function loadFeaturedProducts() {
    const featuredGrid = document.getElementById('featuredProducts');
    if (!featuredGrid) return;
    
    const featured = getFeaturedProducts(6);
    featuredGrid.innerHTML = '';
    
    featured.forEach(product => {
        featuredGrid.appendChild(createProductCard(product));
    });
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('article');
    card.className = 'product-card';
    
    const stockBadge = product.inStock 
        ? '' 
        : '<span class="badge badge-error" style="position: absolute; top: 10px; right: 10px;">Out of Stock</span>';
    
    card.innerHTML = `
        <a href="product-detail.html?id=${product.id}" class="product-card-image">
            ${stockBadge}
            <img src="${product.images[0]}" alt="${product.name}">
        </a>
        <div class="product-card-content">
            <p class="product-card-category">${product.categoryName}</p>
            <h3 class="product-card-title">${product.name}</h3>
            <p class="product-card-price">${formatPrice(product.price)}</p>
        </div>
        <div class="product-card-footer">
            <button class="btn btn-primary btn-block quick-add-btn" data-id="${product.id}" ${!product.inStock ? 'disabled' : ''}>
                ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
        </div>
    `;
    
    // Add quick add to cart functionality
    const addBtn = card.querySelector('.quick-add-btn');
    if (addBtn && product.inStock) {
        addBtn.addEventListener('click', function(e) {
            e.preventDefault();
            addToCart(product.id, 1);
            showNotification('Added to cart!', 'success');
        });
    }
    
    return card;
}

// ==========================================================================
// PRODUCTS PAGE
// ==========================================================================

let currentFilters = {
    categories: [],
    priceRange: null,
    inStockOnly: true,
    searchQuery: '',
    sortBy: 'featured'
};

function initProductsPage() {
    if (!document.querySelector('.products-page')) return;
    
    // Force current filters to clear category parameters on a fresh page load
    currentFilters.categories = [];
    
    // Ensure "All Categories" checkbox is explicitly checked
    const allCategoryCheckbox = document.querySelector('input[name="category"][value="all"]');
    if (allCategoryCheckbox) {
        allCategoryCheckbox.checked = true;
    }

    // Uncheck any other category checkboxes that might be left checked by the browser cache
    const otherCategoryCheckboxes = document.querySelectorAll('input[name="category"]:not([value="all"])');
    otherCategoryCheckboxes.forEach(cb => cb.checked = false);
    
    // Load all products with clean filters
    loadProducts();
    
    // Setup filters
    setupFilters();
    
    // Setup sort
    setupSort();
    
    // Setup search
    setupSearch();
}

function loadProducts() {
    const productGrid = document.getElementById('productGrid');
    const loadingState = document.getElementById('loadingState');
    const emptyState = document.getElementById('emptyState');
    const resultsCount = document.getElementById('resultsCount');
    
    if (!productGrid) return;
    
    // Show loading
    show(loadingState);
    hide(emptyState);
    productGrid.innerHTML = '';
    
    // Simulate loading delay
    setTimeout(() => {
        const filteredProducts = filterAndSortProducts(currentFilters);
        
        hide(loadingState);
        
        if (filteredProducts.length === 0) {
            show(emptyState);
            if (resultsCount) resultsCount.textContent = '0 products';
        } else {
            hide(emptyState);
            if (resultsCount) resultsCount.textContent = `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`;
            
            filteredProducts.forEach(product => {
                productGrid.appendChild(createProductCard(product));
            });
        }
    }, 300);
}

function setupFilters() {
    // Category filters
    const categoryFilters = document.querySelectorAll('input[name="category"]');
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', function() {
            if (this.value === 'all') {
                currentFilters.categories = [];
                // Uncheck other categories
                categoryFilters.forEach(f => {
                    if (f.value !== 'all') f.checked = false;
                });
            } else {
                // Uncheck "all"
                const allFilter = document.querySelector('input[name="category"][value="all"]');
                if (allFilter) allFilter.checked = false;
                
                // Update categories array
                if (this.checked) {
                    currentFilters.categories.push(this.value);
                } else {
                    currentFilters.categories = currentFilters.categories.filter(c => c !== this.value);
                }
            }
            loadProducts();
        });
    });
    
    // Price range filters
    const priceFilters = document.querySelectorAll('input[name="price"]');
    priceFilters.forEach(filter => {
        filter.addEventListener('change', function() {
            if (this.value === 'all') {
                currentFilters.priceRange = null;
            } else {
                const [min, max] = this.value.split('-').map(v => v === '+' ? null : parseFloat(v));
                currentFilters.priceRange = [min, max];
            }
            loadProducts();
        });
    });
    
    // Availability filter
    const inStockFilter = document.querySelector('input[name="availability"][value="in-stock"]');
    if (inStockFilter) {
        inStockFilter.addEventListener('change', function() {
            currentFilters.inStockOnly = this.checked;
            loadProducts();
        });
    }
    
    // Reset filters button
    const resetBtn = document.getElementById('resetFilters');
    const clearBtn = document.getElementById('clearFiltersBtn');
    
    [resetBtn, clearBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function() {
                currentFilters = {
                    categories: [],
                    priceRange: null,
                    inStockOnly: true,
                    searchQuery: '',
                    sortBy: 'featured'
                };
                
                // Reset form
                categoryFilters.forEach(f => f.checked = f.value === 'all');
                priceFilters.forEach(f => f.checked = f.value === 'all');
                if (inStockFilter) inStockFilter.checked = true;
                
                const searchInput = document.getElementById('globalSearch') || document.getElementById('productSearch');
                if (searchInput) searchInput.value = '';
                
                const sortSelect = document.getElementById('sortBy');
                if (sortSelect) sortSelect.value = 'featured';
                
                loadProducts();
            });
        }
    });
    
    // Mobile filter toggle
    const filterToggle = document.querySelector('.filter-toggle');
    const filtersContent = document.querySelector('.filters-content');
    
    if (filterToggle && filtersContent) {
        filterToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            filtersContent.classList.toggle('active');
        });
    }
}

function setupSort() {
    const sortSelect = document.getElementById('sortBy');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentFilters.sortBy = this.value;
            loadProducts();
        });
    }
}

function setupSearch() {
    // Use the sub-header globalSearch; fall back to old productSearch id if present
    const searchInput = document.getElementById('globalSearch') || document.getElementById('productSearch');
    const searchForm  = document.getElementById('globalSearchForm');

    if (searchInput) {
        const debouncedSearch = debounce((value) => {
            currentFilters.searchQuery = value;
            loadProducts();
        }, 300);

        searchInput.addEventListener('input', function() {
            debouncedSearch(this.value);
        });

        // Pre-fill + run search if arriving via ?search= URL param
        const urlParams = new URLSearchParams(window.location.search);
        const q = urlParams.get('search');
        if (q) {
            searchInput.value = q;
            currentFilters.searchQuery = q;
        }
    }

    // Prevent globalSearchForm from navigating away on the products page
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (searchInput) {
                currentFilters.searchQuery = searchInput.value;
                loadProducts();
            }
        });
    }
}

// ==========================================================================
// PRODUCT DETAIL PAGE
// ==========================================================================

function initProductDetailPage() {
    if (!document.querySelector('.product-detail-page')) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId) {
        window.location.href = 'products.html';
        return;
    }
    
    const product = getProductById(productId);
    if (!product) {
        window.location.href = 'products.html';
        return;
    }
    
    // Populate product details
    loadProductDetails(product);
    
    // Setup image gallery
    setupImageGallery(product);
    
    // Setup quantity controls
    setupQuantityControls();
    
    // Setup add to cart
    setupAddToCart(product);
    
    // Load related products
    loadRelatedProducts(productId);
}

function loadProductDetails(product) {
    // Update breadcrumb
    const breadcrumbCategory = document.getElementById('breadcrumbCategory');
    const breadcrumbProduct = document.getElementById('breadcrumbProduct');
    if (breadcrumbCategory) breadcrumbCategory.textContent = product.categoryName;
    if (breadcrumbProduct) breadcrumbProduct.textContent = product.name;
    
    // Update product info
    document.getElementById('productCategory').textContent = product.categoryName;
    document.getElementById('productTitle').textContent = product.name;
    document.getElementById('productPrice').textContent = formatPrice(product.price);
    document.getElementById('productDescription').textContent = product.description;
    
    // Stock status
    const stockStatus = document.getElementById('stockStatus');
    if (stockStatus) {
        stockStatus.innerHTML = product.inStock 
            ? '<span class="in-stock">✓ In Stock</span>'
            : '<span class="out-of-stock">✗ Out of Stock</span>';
    }
    
    // Product details
    const detailsList = document.getElementById('productDetailsList');
    if (detailsList && product.details) {
        detailsList.innerHTML = `
            <li><strong>Material:</strong> ${product.details.material}</li>
            <li><strong>Dimensions:</strong> ${product.details.dimensions}</li>
            <li><strong>Weight:</strong> ${product.details.weight}</li>
            <li><strong>Care:</strong> ${product.details.care}</li>
            <li><strong>Origin:</strong> ${product.details.origin}</li>
        `;
    }
    
    // Update page title
    document.title = `${product.name} - ShopLocal`;
}

function setupImageGallery(product) {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (mainImage && product.images && product.images.length > 0) {
        mainImage.src = product.images[0];
        mainImage.alt = product.name;
    }
    
    thumbnails.forEach((thumb, index) => {
        if (product.images[index]) {
            const img = thumb.querySelector('img');
            img.src = product.images[index];
            img.alt = `${product.name} view ${index + 1}`;
            
            thumb.addEventListener('click', function() {
                mainImage.src = product.images[index];
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        }
    });
}

function setupQuantityControls() {
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    
    if (!quantityInput) return;
    
    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', function() {
            const current = parseInt(quantityInput.value);
            if (current > 1) {
                quantityInput.value = current - 1;
            }
        });
    }
    
    if (increaseBtn) {
        increaseBtn.addEventListener('click', function() {
            const current = parseInt(quantityInput.value);
            const max = parseInt(quantityInput.max);
            if (current < max) {
                quantityInput.value = current + 1;
            }
        });
    }
}

function setupAddToCart(product) {
    const addToCartBtn = document.getElementById('addToCartBtn');
    const quantityInput = document.getElementById('quantity');
    const successMessage = document.getElementById('successMessage');
    
    if (!addToCartBtn || !product.inStock) return;
    
    addToCartBtn.addEventListener('click', function() {
        const quantity = parseInt(quantityInput.value);
        
        if (addToCart(product.id, quantity)) {
            show(successMessage);
            
            // Hide success message after 3 seconds
            setTimeout(() => {
                hide(successMessage);
            }, 3000);
        }
    });
}

function loadRelatedProducts(productId) {
    const relatedGrid = document.getElementById('relatedProducts');
    if (!relatedGrid) return;
    
    const related = getRelatedProducts(productId, 4);
    relatedGrid.innerHTML = '';
    
    related.forEach(product => {
        relatedGrid.appendChild(createProductCard(product));
    });
}

// ==========================================================================
// CART PAGE
// ==========================================================================

function initCartPage() {
    if (!document.querySelector('.cart-page')) return;
    
    loadCartItems();
    updateCartSummary();
    setupPromoCode();
    loadRecommendedProducts();
}

function loadCartItems() {
    const cartItemsList = document.getElementById('cartItemsList');
    const emptyCart = document.getElementById('emptyCart');
    const continueShopping = document.getElementById('continueShopping');
    const cartSummary = document.getElementById('cartSummary');
    
    if (!cartItemsList) return;
    
    const items = getCartItems();
    
    if (items.length === 0) {
        show(emptyCart);
        hide(continueShopping);
        hide(cartSummary);
        cartItemsList.innerHTML = '';
        return;
    }
    
    hide(emptyCart);
    show(continueShopping);
    show(cartSummary);
    
    cartItemsList.innerHTML = '';
    
    items.forEach(item => {
        const cartItem = createCartItem(item);
        cartItemsList.appendChild(cartItem);
    });
    
    updateShippingProgress();
}

function createCartItem(item) {
    const article = document.createElement('article');
    article.className = 'cart-item';
    article.dataset.id = item.id;
    
    article.innerHTML = `
        <div class="item-image">
            <img src="${item.product.images[0]}" alt="${item.product.name}" class="cart-item-img">
        </div>
        
        <div class="item-details">
            <h3 class="item-name">${item.product.name}</h3>
            <p class="item-category">${item.product.categoryName}</p>
            <p class="item-price">${formatPrice(item.product.price)} each</p>
        </div>
        
        <div class="item-quantity">
            <div class="quantity-controls">
                <button class="quantity-btn decrease-btn" aria-label="Decrease quantity">−</button>
                <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" aria-label="Quantity">
                <button class="quantity-btn increase-btn" aria-label="Increase quantity">+</button>
            </div>
        </div>
        
        <div class="item-total">
            <p class="item-total-price">${formatPrice(item.product.price * item.quantity)}</p>
        </div>
        
        <button class="item-remove" aria-label="Remove item">
            <span>×</span>
        </button>
    `;
    
    // Setup quantity controls
    const decreaseBtn = article.querySelector('.decrease-btn');
    const increaseBtn = article.querySelector('.increase-btn');
    const quantityInput = article.querySelector('.quantity-input');
    
    decreaseBtn.addEventListener('click', () => {
        const newQty = Math.max(1, item.quantity - 1);
        updateCartItemQuantity(item.id, newQty);
        loadCartItems();
        updateCartSummary();
    });
    
    increaseBtn.addEventListener('click', () => {
        const newQty = Math.min(10, item.quantity + 1);
        updateCartItemQuantity(item.id, newQty);
        loadCartItems();
        updateCartSummary();
    });
    
    quantityInput.addEventListener('change', function() {
        const newQty = Math.min(10, Math.max(1, parseInt(this.value) || 1));
        updateCartItemQuantity(item.id, newQty);
        loadCartItems();
        updateCartSummary();
    });
    
    // Setup remove button
    const removeBtn = article.querySelector('.item-remove');
    removeBtn.addEventListener('click', () => {
        if (confirm(`Remove ${item.product.name} from cart?`)) {
            removeFromCart(item.id);
            loadCartItems();
            updateCartSummary();
            showNotification('Item removed from cart', 'info');
        }
    });
    
    return article;
}

function updateCartSummary() {
    const totals = getCartTotal();
    
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl) subtotalEl.textContent = formatPrice(totals.subtotal);
    if (shippingEl) shippingEl.textContent = totals.shipping === 0 ? 'FREE' : formatPrice(totals.shipping);
    if (taxEl) taxEl.textContent = formatPrice(totals.tax);
    if (totalEl) totalEl.textContent = formatPrice(totals.total);
    
    // Also update checkout page summary if present
    const summarySubtotal = document.getElementById('summarySubtotal');
    const summaryShipping = document.getElementById('summaryShipping');
    const summaryTax = document.getElementById('summaryTax');
    const summaryTotal = document.getElementById('summaryTotal');
    
    if (summarySubtotal) summarySubtotal.textContent = formatPrice(totals.subtotal);
    if (summaryShipping) summaryShipping.textContent = totals.shipping === 0 ? 'FREE' : formatPrice(totals.shipping);
    if (summaryTax) summaryTax.textContent = formatPrice(totals.tax);
    if (summaryTotal) summaryTotal.textContent = formatPrice(totals.total);
}

function updateShippingProgress() {
    const progress = getShippingProgress();
    const progressBar = document.getElementById('shippingProgress');
    const progressText = document.getElementById('shippingProgressText');
    const shippingBanner = document.getElementById('shippingBanner');
    
    if (progressBar) {
        progressBar.style.width = `${progress.progress}%`;
    }
    
    if (progressText) {
        if (progress.qualified) {
            progressText.textContent = 'You qualify for free shipping!';
            progressText.style.color = 'var(--color-success)';
        } else {
            progressText.textContent = `Add ${formatPrice(progress.remaining)} more to qualify for free shipping`;
            progressText.style.color = 'var(--color-text-secondary)';
        }
    }
}

function setupPromoCode() {
    const promoForm = document.getElementById('promoForm');
    const promoInput = document.getElementById('promoCode');
    const promoMessage = document.getElementById('promoMessage');
    
    if (!promoForm) return;
    
    promoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const code = promoInput.value.trim();
        if (!code) return;
        
        const result = applyPromoCode(code);
        
        show(promoMessage);
        
        if (result.success) {
            promoMessage.textContent = `✓ Promo code applied: ${result.promo.description}`;
            promoMessage.className = 'promo-message success';
        } else {
            promoMessage.textContent = `✗ ${result.message}`;
            promoMessage.className = 'promo-message error';
        }
        
        setTimeout(() => {
            hide(promoMessage);
        }, 3000);
    });
}

function loadRecommendedProducts() {
    const recommendedGrid = document.getElementById('recommendedProducts');
    if (!recommendedGrid) return;
    
    // Get random products
    const recommended = products.filter(p => p.inStock).sort(() => 0.5 - Math.random()).slice(0, 4);
    recommendedGrid.innerHTML = '';
    
    recommended.forEach(product => {
        recommendedGrid.appendChild(createProductCard(product));
    });
}

// ==========================================================================
// CHECKOUT PAGE
// ==========================================================================

function initCheckoutPage() {
    if (!document.querySelector('.checkout-page')) return;
    
    // Check if cart is empty
    if (getCartCount() === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    updateCartSummary();
    loadCheckoutItems();
    setupCheckoutForm();
}

function loadCheckoutItems() {
    const summaryItems = document.getElementById('summaryItems');
    if (!summaryItems) return;
    
    const items = getCartItems();
    summaryItems.innerHTML = '';
    
    items.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'summary-item-row';
        itemEl.innerHTML = `
            <span>${item.product.name} × ${item.quantity}</span>
            <span>${formatPrice(item.product.price * item.quantity)}</span>
        `;
        summaryItems.appendChild(itemEl);
    });
}

function setupCheckoutForm() {
    const form = document.getElementById('checkoutForm');
    if (!form) return;
    
    // Multi-step navigation
    const continueToPaymentBtn = document.getElementById('continueToPayment');
    const backToShippingBtn = document.getElementById('backToShipping');
    const reviewOrderBtn = document.getElementById('reviewOrder');
    const backToPaymentBtn = document.getElementById('backToPayment');
    
    const shippingSection = document.getElementById('shippingSection');
    const paymentSection = document.getElementById('paymentSection');
    const reviewSection = document.getElementById('reviewSection');
    
    const steps = document.querySelectorAll('.step');
    
    if (continueToPaymentBtn) {
        continueToPaymentBtn.addEventListener('click', function() {
            if (validateSection(shippingSection)) {
                hide(shippingSection);
                show(paymentSection);
                updateStepIndicator(1);
            }
        });
    }
    
    if (backToShippingBtn) {
        backToShippingBtn.addEventListener('click', function() {
            hide(paymentSection);
            show(shippingSection);
            updateStepIndicator(0);
        });
    }
    
    if (reviewOrderBtn) {
        reviewOrderBtn.addEventListener('click', function() {
            if (validateSection(paymentSection)) {
                populateReview();
                hide(paymentSection);
                show(reviewSection);
                updateStepIndicator(2);
            }
        });
    }
    
    if (backToPaymentBtn) {
        backToPaymentBtn.addEventListener('click', function() {
            hide(reviewSection);
            show(paymentSection);
            updateStepIndicator(1);
        });
    }
    
    function updateStepIndicator(activeIndex) {
        steps.forEach((step, index) => {
            if (index === activeIndex) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateSection(reviewSection)) {
            // Simulate order processing
            alert('Order placed successfully! (This is a demo - no actual payment was processed)');
            clearCart();
            window.location.href = 'index.html';
        }
    });
    
    // Form validation
    const inputs = form.querySelectorAll('input[required], select[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('invalid')) {
                validateField(this);
            }
        });
    });
}

function validateSection(section) {
    if (!section) return true;
    
    const inputs = section.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const errorId = `${field.id}Error`;
    const errorElement = document.getElementById(errorId);
    
    let isValid = true;
    let errorMessage = '';
    
    if (!field.value.trim()) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (field.type === 'email' && !isValidEmail(field.value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
    } else if (field.type === 'tel' && !isValidPhone(field.value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
    }
    
    if (errorElement) {
        errorElement.textContent = errorMessage;
        if (isValid) {
            errorElement.classList.remove('active');
            field.classList.remove('invalid');
        } else {
            errorElement.classList.add('active');
            field.classList.add('invalid');
        }
    }
    
    return isValid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^[\d\s\-\+\(\)]+$/.test(phone);
}

function populateReview() {
    const reviewShipping = document.getElementById('reviewShipping');
    const reviewPayment = document.getElementById('reviewPayment');
    const reviewItems = document.getElementById('reviewItems');
    
    if (reviewShipping) {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const region = document.getElementById('region').value;
        
        reviewShipping.innerHTML = `
            <p>${firstName} ${lastName}</p>
            <p>${address}</p>
            <p>${city}, ${region}</p>
        `;
    }
    
    if (reviewPayment) {
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
        const methodText = paymentMethod ? paymentMethod.nextElementSibling.textContent : 'Not selected';
        reviewPayment.innerHTML = `<p>${methodText}</p>`;
    }
    
    if (reviewItems) {
        const items = getCartItems();
        reviewItems.innerHTML = '';
        
        items.forEach(item => {
            const itemEl = document.createElement('p');
            itemEl.textContent = `${item.product.name} × ${item.quantity} - ${formatPrice(item.product.price * item.quantity)}`;
            reviewItems.appendChild(itemEl);
        });
    }
}

// ==========================================================================
// NOTIFICATIONS
// ==========================================================================

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--color-success);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    if (type === 'error') {
        notification.style.backgroundColor = 'var(--color-error)';
    } else if (type === 'info') {
        notification.style.backgroundColor = 'var(--color-info)';
    }
    
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==========================================================================
// INITIALIZE ON DOM LOAD
// ==========================================================================

// ==========================================================================
// PROFILE DROPDOWN (runs on every page)
// ==========================================================================

function initProfileDropdown() {
    const drop = document.getElementById('profileDropdown');
    const btn  = document.getElementById('profileBtn');
    const menu = document.getElementById('profileMenu');
    if (!drop || !btn || !menu) return;

    // Build menu content based on auth state
    function buildMenu() {
        const user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
        if (user) {
            const initial = (user.firstName || user.email || '?').charAt(0).toUpperCase();
            btn.innerHTML = '<span class="profile-avatar">' + initial + '</span><span class="profile-chevron">▾</span>';
            menu.innerHTML =
                '<div class="profile-menu-header"><strong>' + (user.firstName || '') + ' ' + (user.lastName || '') + '</strong><span>' + user.email + '</span></div>' +
                '<div class="profile-menu-divider"></div>' +
                '<a class="profile-menu-item" href="profile.html"><span>👤</span> My Profile</a>' +
                '<a class="profile-menu-item" href="orders.html"><span>📦</span> My Orders</a>' +
                '<a class="profile-menu-item" href="wishlist.html"><span>♡</span> Wishlist</a>' +
                '<div class="profile-menu-divider"></div>' +
                '<button class="profile-menu-item profile-menu-logout" id="profileDropdownLogout"><span>🚪</span> Sign Out</button>';
            const logoutBtn = document.getElementById('profileDropdownLogout');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    closeDropdown();
                    if (confirm('Sign out of ShopLocal?')) {
                        localStorage.removeItem('shoplocal_user');
                        window.location.href = 'index.html';
                    }
                });
            }
        } else {
            const path     = window.location.pathname;
            const isLogin  = path.includes('login.html');
            const isSignup = path.includes('signup.html');
            btn.innerHTML = '<svg class="profile-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg><span class="profile-chevron">▾</span>';
            menu.innerHTML =
                '<div class="profile-menu-guest"><p>Welcome to ShopLocal</p></div>' +
                '<div class="profile-menu-divider"></div>' +
                '<a class="profile-menu-item profile-menu-item--primary' + (isLogin ? ' active' : '') + '" href="login.html"><span>🔑</span> Sign In</a>' +
                '<a class="profile-menu-item' + (isSignup ? ' active' : '') + '" href="signup.html"><span>✨</span> Create Account</a>';
        }
    }

    function openDropdown()  { drop.classList.add('open');    btn.setAttribute('aria-expanded', 'true'); }
    function closeDropdown() { drop.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }

    buildMenu();

    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        drop.classList.contains('open') ? closeDropdown() : openDropdown();
    });

    document.addEventListener('click', function (e) {
        if (!drop.contains(e.target)) closeDropdown();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeDropdown();
    });
}

// ==========================================================================
// GLOBAL SEARCH (redirect to products page)
// ==========================================================================

function initGlobalSearch() {
    const form = document.getElementById('globalSearchForm');
    if (!form) return;
    const path = window.location.pathname.split('/').pop() || 'index.html';
    if (path === 'products.html') return; // products.js handles it there
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const q = document.getElementById('globalSearch').value.trim();
        if (q) window.location.href = 'products.html?search=' + encodeURIComponent(q);
    });
}

// ==========================================================================
// INITIALIZE ON DOM LOAD
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize common components
    initMobileMenu();
    updateCartCount();
    initProfileDropdown();
    initGlobalSearch();

    // Sync auth state on every page (requires auth.js loaded before main.js)
    if (typeof initAuth === 'function')     initAuth();
    if (typeof updateAuthUI === 'function') updateAuthUI();
    
    // Initialize page-specific functionality
    loadFeaturedProducts();
    initProductsPage();
    initProductDetailPage();
    initCartPage();
    initCheckoutPage();
});
// Cart System using localStorage

// Product Data
const products = [
    {
        id: 1,
        name: "Velvet Chesterfield",
        price: 203350,
        image: "https://images.unsplash.com/photo-1551298370-9d3d53a5c220?w=500&h=500&fit=crop",
        category: "Sofas"
    },
    {
        id: 2,
        name: "Nordic Armchair",
        price: 73870,
        image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&h=500&fit=crop",
        category: "Chairs"
    },
    {
        id: 3,
        name: "Marble Dining Table",
        price: 212480,
        originalPrice: 265600,
        image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=500&h=500&fit=crop",
        category: "Tables"
    },
    {
        id: 4,
        name: "Canopy King Bed",
        price: 340300,
        image: "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=500&h=500&fit=crop",
        category: "Beds"
    },
    {
        id: 5,
        name: "Geometric Coffee Table",
        price: 99600,
        image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&h=500&fit=crop",
        category: "Tables"
    },
    {
        id: 6,
        name: "Modular Bookshelf",
        price: 153550,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop",
        category: "Storage"
    },
    {
        id: 7,
        name: "Modern Sectional Sofa",
        price: 322870,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop",
        category: "Sofas"
    },
    {
        id: 8,
        name: "Velvet Accent Chair",
        price: 79680,
        originalPrice: 99600,
        image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500&h=500&fit=crop",
        category: "Chairs"
    },
    {
        id: 9,
        name: "Rustic Console Table",
        price: 64740,
        image: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=500&h=500&fit=crop",
        category: "Tables"
    },
    {
        id: 10,
        name: "Platform Queen Bed",
        price: 236550,
        image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&h=500&fit=crop",
        category: "Beds"
    },
    {
        id: 11,
        name: "Marble Nightstand",
        price: 37350,
        image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=500&h=500&fit=crop",
        category: "Tables"
    },
    {
        id: 12,
        name: "Italian Leather Sofa",
        price: 431600,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop&q=80",
        category: "Sofas"
    }
];

// Get cart from localStorage
function getCart() {
    const cart = localStorage.getItem('luxeCart');
    return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('luxeCart', JSON.stringify(cart));
    updateCartCount();
}

// Add item to cart
function addToCart(productId, quantity = 1) {
    const cart = getCart();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        console.error('Product not found');
        return false;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    saveCart(cart);
    return true;
}

// Remove item from cart
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
}

// Update item quantity
function updateQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCart(cart);
        }
    }
}

// Calculate totals
function calculateTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 0 : 0; // Free shipping
    const tax = Math.round(subtotal * 0.09 * 100) / 100; // 9% tax
    const total = subtotal + shipping + tax;
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    return { subtotal, shipping, tax, total, itemCount };
}

// Update cart count in navbar
function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartBadges = document.querySelectorAll('.cart-count');
    
    cartBadges.forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline' : 'none';
    });
}

// Format price
function formatPrice(price) {
    return '₹' + price.toLocaleString();
}

// Initialize add to cart buttons
function initAddToCartButtons() {
    const buttons = document.querySelectorAll('[data-product-id]');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productId = parseInt(this.getAttribute('data-product-id'));
            const btn = this;
            
            // Add animation class
            btn.classList.add('adding');
            
            // Add to cart
            const added = addToCart(productId);
            
            if (added) {
                // Show success state
                btn.classList.add('added');
                btn.innerHTML = '<span class="btn-text">Added ✓</span>';
                
                // Reset after delay
                setTimeout(() => {
                    btn.classList.remove('adding', 'added');
                    btn.innerHTML = '<span class="btn-text">Add to Cart</span>';
                }, 2000);
            }
        });
    });
}

// Initialize buy now buttons
function initBuyNowButtons() {
    const buttons = document.querySelectorAll('[data-buy-id]');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productId = parseInt(this.getAttribute('data-buy-id'));
            addToCart(productId);
            window.location.href = 'cart.html';
        });
    });
}

// Initialize quantity controls
function initQuantityControls() {
    document.querySelectorAll('.qty-increase').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            const input = this.parentElement.querySelector('.qty-input');
            let value = parseInt(input.value) || 1;
            value++;
            input.value = value;
            updateQuantity(productId, value);
            updateCartTotals();
        });
    });
    
    document.querySelectorAll('.qty-decrease').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            const input = this.parentElement.querySelector('.qty-input');
            let value = parseInt(input.value) || 1;
            if (value > 1) {
                value--;
                input.value = value;
                updateQuantity(productId, value);
                updateCartTotals();
            }
        });
    });
    
    document.querySelectorAll('.qty-input').forEach(input => {
        input.addEventListener('change', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            let value = parseInt(this.value) || 1;
            if (value < 1) value = 1;
            this.value = value;
            updateQuantity(productId, value);
            updateCartTotals();
        });
    });
}

// Initialize remove buttons
function initRemoveButtons() {
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            const cartItem = this.closest('.cart-item');
            
            // Animate removal
            cartItem.style.opacity = '0';
            cartItem.style.transform = 'translateX(100px)';
            
            setTimeout(() => {
                removeFromCart(productId);
                renderCart();
            }, 300);
        });
    });
}

// Initialize clear cart button
function initClearCart() {
    const clearBtn = document.querySelector('.btn-clear-cart');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear the cart?')) {
                localStorage.removeItem('luxeCart');
                renderCart();
            }
        });
    }
}

// Update cart totals display
function updateCartTotals() {
    const totals = calculateTotals();
    
    const subtotalEl = document.querySelector('.summary-subtotal');
    const shippingEl = document.querySelector('.summary-shipping');
    const taxEl = document.querySelector('.summary-tax');
    const totalEl = document.querySelector('.summary-total-price');
    const countEl = document.querySelector('.items-count');
    
    if (subtotalEl) subtotalEl.textContent = formatPrice(totals.subtotal);
    if (shippingEl) shippingEl.textContent = totals.shipping === 0 ? 'FREE' : formatPrice(totals.shipping);
    if (taxEl) taxEl.textContent = formatPrice(totals.tax);
    if (totalEl) totalEl.textContent = formatPrice(totals.total);
    if (countEl) countEl.textContent = totals.itemCount + ' item' + (totals.itemCount !== 1 ? 's' : '');
}

// Render cart page
function renderCart() {
    const cartContainer = document.querySelector('.cart-items-list');
    const emptyCart = document.querySelector('.cart-empty');
    const cartContent = document.querySelector('.cart-content');
    
    if (!cartContainer) return;
    
    const cart = getCart();
    
    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'flex';
        if (cartContent) cartContent.style.display = 'none';
        return;
    }
    
    if (emptyCart) emptyCart.style.display = 'none';
    if (cartContent) cartContent.style.display = 'grid';
    
    const totals = calculateTotals();
    
    // Build cart items HTML
    let cartHTML = `
        <div class="cart-header">
            <span class="cart-col-product">Product</span>
            <span class="cart-col-price">Price</span>
            <span class="cart-col-qty">Quantity</span>
            <span class="cart-col-total">Total</span>
            <span class="cart-col-remove"></span>
        </div>
    `;
    
    cart.forEach(item => {
        cartHTML += `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-product">
                    <a href="product-details.html?id=${item.id}" class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </a>
                    <div class="cart-item-details">
                        <a href="product-details.html?id=${item.id}"><h3>${item.name}</h3></a>
                        <p>Premium Quality</p>
                        <p class="item-sku">SKU: LUX-${String(item.id).padStart(3, '0')}</p>
                    </div>
                </div>
                <div class="cart-item-price" data-label="Price">${formatPrice(item.price)}</div>
                <div class="cart-item-qty" data-label="Quantity">
                    <div class="qty-controls-static">
                        <button class="qty-btn-static qty-decrease" data-product-id="${item.id}">−</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn-static qty-increase" data-product-id="${item.id}">+</button>
                    </div>
                </div>
                <div class="cart-item-total" data-label="Total">${formatPrice(item.price * item.quantity)}</div>
                <div class="cart-item-remove">
                    <button class="remove-btn" data-product-id="${item.id}" title="Remove item">×</button>
                </div>
            </div>
        `;
    });
    
    cartContainer.innerHTML = cartHTML;
    
    // Update totals
    updateCartTotals();
    
    // Reinitialize controls
    initQuantityControls();
    initRemoveButtons();
}

// Load product details from URL
function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId) return;
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Update page elements
    const titleEl = document.querySelector('.product-title');
    const priceEl = document.querySelector('.current-price');
    const descEl = document.querySelector('.product-description-details');
    const mainImgEl = document.getElementById('mainImage');
    const breadcrumbEl = document.querySelector('.breadcrumb-current');
    const buyBtn = document.querySelector('.btn-buy-details');
    const addBtn = document.querySelector('.btn-cart-details');
    
    if (titleEl) titleEl.textContent = product.name;
    if (priceEl) priceEl.textContent = formatPrice(product.price);
    if (breadcrumbEl) breadcrumbEl.textContent = product.name;
    if (mainImgEl) mainImgEl.src = product.image.replace('w=500', 'w=800').replace('h=500', 'h=800');
    
    if (buyBtn) {
        buyBtn.setAttribute('data-buy-id', product.id);
    }
    
    if (addBtn) {
        addBtn.setAttribute('data-product-id', product.id);
    }
    
    // Update document title
    document.title = product.name + ' | LUXE Premium Furniture';
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Initialize buttons
    initAddToCartButtons();
    initBuyNowButtons();
    
    // If on cart page, render cart
    if (document.querySelector('.cart-page')) {
        renderCart();
        initClearCart();
    }
    
    // If on product details page, load details
    if (document.querySelector('.product-details')) {
        loadProductDetails();
    }
});

// Export functions for use in inline handlers
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.getCart = getCart;
window.calculateTotals = calculateTotals;
window.formatPrice = formatPrice;
window.renderCart = renderCart;
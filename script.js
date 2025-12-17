const products = [
    {id:0, name:'PowerMax Treadmill 300i', price:45999, tags:['gym','equipment'], img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=220&fit=crop'},
    {id:1, name:'Adjustable Dumbbells 24kg', price:12499, tags:['gym','equipment'], img:'https://images.unsplash.com/photo-1574063346896-b1e9123ee4f6?w=400&h=220&fit=crop'},
    {id:2, name:'Spin Bike SB300', price:28499, tags:['gym','equipment'], img:'https://images.unsplash.com/photo-1600439515648-0e36483a673a?w=400&h=220&fit=crop'},
    {id:3, name:'Multi Gym Bench Pro', price:18999, tags:['gym','equipment'], img:'https://images.unsplash.com/photo-1599058916484-3e9f6ca43d91?w=400&h=220&fit=crop'},
    {id:4, name:'Nike Dry-Fit T-Shirt', price:1499, tags:['gym','running','apparel'], img:'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=220&fit=crop'},
    {id:5, name:'Adidas Training Shorts', price:1299, tags:['gym','apparel'], img:'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&h=220&fit=crop'},
    {id:6, name:'HRX High Waist Leggings', price:1799, tags:['yoga','gym','apparel'], img:'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=220&fit=crop'},
    {id:7, name:'Puma Sports Bra Medium', price:1299, tags:['yoga','apparel'], img:'https://images.unsplash.com/photo-1558030004-5b7f3ddeff9f?w=400&h=220&fit=crop'},
    {id:8, name:'ASICS Gel-Kayano 30', price:12999, tags:['running','footwear'], img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=220&fit=crop'},
    {id:9, name:'Nike Metcon 9', price:9999, tags:['gym','footwear'], img:'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=220&fit=crop'},
    {id:10, name:'Reebok Nano X4', price:8999, tags:['gym','footwear'], img:'https://images.unsplash.com/photo-1603803547952-0d95cb5ff9d8?w=400&h=220&fit=crop'},
    {id:11, name:'Liforme Yoga Mat 6mm', price:3999, tags:['yoga','accessories'], img:'https://images.unsplash.com/photo-1552674606-9a5a63d2d720?w=400&h=220&fit=crop'},
    {id:12, name:'Everlast Boxing Gloves 14oz', price:2499, tags:['boxing','accessories'], img:'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=220&fit=crop'},
    {id:13, name:'Optimum Nutrition Whey Gold 2kg', price:5999, tags:['gym','nutrition'], img:'https://images.unsplash.com/photo-1581129724999-7a6bf24ffec8?w=400&h=220&fit=crop'},
    {id:14, name:'MuscleBlaze BCAA Pro 30srv', price:1499, tags:['gym','nutrition'], img:'https://images.unsplash.com/photo-1611464660528-7439a2904a0a?w=400&h=220&fit=crop'},
    {id:15, name:'Decathlon Domyos Dumbbells', price:2999, tags:['gym','equipment'], img:'https://images.unsplash.com/photo-1581756781317-29a1599f8d75?w=400&h=220&fit=crop'},
    {id:16, name:'Cult Running T-Shirt', price:999, tags:['running','apparel'], img:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=220&fit=crop'},
    {id:17, name:'Under Armour Charged Shoes', price:7999, tags:['running','footwear'], img:'https://images.unsplash.com/photo-1548036300-12232248da6a?w=400&h=220&fit=crop'},
    {id:18, name:'Resistance Bands Set', price:1999, tags:['gym','accessories'], img:'https://images.unsplash.com/photo-1586083703154-1e62d1a0b10e?w=400&h=220&fit=crop'},
    {id:19, name:'Creatine Monohydrate 300g', price:1299, tags:['gym','nutrition'], img:'https://images.unsplash.com/photo-1603354356598-342d99ed1b1e?w=400&h=220&fit=crop'}
];

let cart = JSON.parse(localStorage.getItem('fytro_cart')) || [];
let quantities = JSON.parse(localStorage.getItem('fytro_quantities')) || {};
let currentFilter = 'all';

products.forEach(p => { if (quantities[p.id] === undefined) quantities[p.id] = 0; });

document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCartDisplay();
    setupFilters();
    setupCartToggle();
    setupFeedbackForm();
    setupContactForm();
});

// BACKEND LOGIC: SILENT UPDATE TO GOOGLE SHEETS
function setupFeedbackForm() {
    const feedbackForm = document.getElementById('feedback-form');
    if (!feedbackForm) return;

    feedbackForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // YOUR NEW URL
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzllOZ_CSdTvzjXz58bhGfDk2fER5FA9NzNCL-w3RmiEUiKthavb3MvYFWL1cHSWwFkZg/exec';

        const feedback = {
            orderId: 'FYTRO-' + Date.now(),
            timestamp: new Date().toLocaleString('en-IN'),
            productRating: document.getElementById('product-rating')?.value || '0',
            deliveryRating: document.getElementById('delivery-rating')?.value || '0',
            source: document.getElementById('feedback-source')?.value || 'unknown',
            comments: document.getElementById('feedback-text')?.value || 'No comments'
        };

        const submitBtn = document.getElementById('submit-feedback-btn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Saving...";
        }

        try {
            // Using 'text/plain' helps bypass CORS issues with Google Apps Script
            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', 
                cache: 'no-cache',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify(feedback)
            });

            alert("Feedback submitted successfully!");
            goToHome(); 
            this.reset();
        } catch(error) {
            console.error("Submission Error:", error);
            alert("Error saving feedback. Please try again.");
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = "Submit Feedback";
            }
        }
    });
}

// ... (Rest of your script functions: changeQty, addToCart, renderProducts, etc. remain the same) ...

function changeQty(id, delta) {
    let qty = (quantities[id] || 0) + delta;
    if (qty < 0) qty = 0; if (qty > 99) qty = 99;
    quantities[id] = qty;
    localStorage.setItem('fytro_quantities', JSON.stringify(quantities));
    renderProducts();
}

function addToCart(id) {
    const qty = quantities[id];
    if (qty <= 0) return;
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    if (existing) existing.quantity += qty; 
    else cart.push({...product, quantity: qty});
    quantities[id] = 0;
    localStorage.setItem('fytro_cart', JSON.stringify(cart));
    localStorage.setItem('fytro_quantities', JSON.stringify(quantities));
    updateCartDisplay(); 
    renderProducts();
}

function renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    const filteredProducts = products.filter(p => currentFilter === 'all' || p.tags.includes(currentFilter));
    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-product="${product.id}">
            <div class="product-img"><img src="${product.img}" alt="${product.name}"></div>
            <div class="product-info">
                <h5>${product.name}</h5>
                <div class="price">₹${product.price.toLocaleString()}</div>
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="changeQty(${product.id}, -1)">−</button>
                    <span class="qty-display">${quantities[product.id] || 0}</span>
                    <button class="qty-btn" onclick="changeQty(${product.id}, 1)">+</button>
                </div>
                <button class="add-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

function updateCartDisplay() {
    const cartCountEl = document.getElementById('cart-count');
    const cartTotalEl = document.getElementById('cart-total');
    const cartItemsEl = document.getElementById('cart-items');
    if (!cartCountEl || !cartTotalEl || !cartItemsEl) return;
    
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = cartCount;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalEl.textContent = total.toLocaleString();
    
    cartItemsEl.innerHTML = cart.length === 0 ? '<p>Your cart is empty</p>' : cart.map(item => `
        <div class="cart-item">
            <span>${item.name} (x${item.quantity})</span>
            <span>₹${(item.price * item.quantity).toLocaleString()}</span>
        </div>
    `).join('');
}

function setupFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.filter;
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProducts();
        });
    });
}

function toggleCart() { 
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar) sidebar.classList.toggle('active'); 
}

function setupCartToggle() { 
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) cartIcon.addEventListener('click', (e) => { e.preventDefault(); toggleCart(); });
}

function checkout() {
    if (cart.length === 0) return;
    cart = []; 
    localStorage.setItem('fytro_cart', JSON.stringify(cart)); 
    updateCartDisplay();
    document.getElementById('order-modal').classList.remove('hidden');
    toggleCart();
}

function showFeedback() { 
    document.getElementById('order-modal').classList.add('hidden'); 
    document.getElementById('feedback-modal').classList.remove('hidden'); 
}

function goToHome() { 
    document.getElementById('feedback-modal').classList.add('hidden'); 
    document.getElementById('order-modal').classList.add('hidden'); 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
}

function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const msg = document.getElementById('contact-message')?.value || '';
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=kshitivinod@gmail.com&su=FYTRO&body=${msg}`);
        this.reset();
    });
}